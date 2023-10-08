from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from product.models import Product
from productseller.models import ProductSeller
from productseller.serializers import ProductSellerSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from fuzzywuzzy import fuzz
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from decimal import Decimal
from django.http import FileResponse
import os
from django.conf import settings
from seller.models import Seller


@api_view(["POST"])
@permission_classes([AllowAny])
def getProd(request):
    try:
        user = request.user
        seller_name = user.business_name

        # # remove this later
        # seller_name = "Takealot"

        search = request.data.get("search")
        search_option = request.data.get("searchOption")

        # sorting options[price, discount, name]
        sort_fields = {
            "name": "product__name",
            "-name": "-product__name",
            "price": "price",
            "-price": "-price",
            "discount": "discount",
            "-discount": "-discount",
        }

        sort = request.data.get("sortOption")

        # filter options[in stock, price, category]
        filter_options = request.data.get("filterOptions")

        filter_fields_list = {
            "all": None,
            "in": True,
            "out": False,
        }

        filter_in_stock = filter_fields_list[filter_options.get("filter_in_stock")]

        filter_category = filter_options.get("filter_category")
        filter_price_min = filter_options.get("filter_price_min")
        filter_price_max = filter_options.get("filter_price_max")

        # Filtering of the products
        filters = Q(seller__business_name=seller_name)
        # searching
        if search and len(search) > 0:
            if search_option == "id":
                if not search.isnumeric():
                    return Response({"data": [], "total_count": 0})

                filters &= Q(product__id=search)
            elif search_option == "category":
                filters &= Q(product__category__icontains=search)
            else:
                filters &= Q(product__name__icontains=search)

        if filter_in_stock is not None:
            filters &= Q(in_stock=filter_in_stock)
        if filter_category:
            categories_values = filter_category.split(
                ",,,"
            )  # Split the filter_categories value by comma

            category_filters = Q()  # Create a separate Q object for category filters

            for category_value in categories_values:
                category_filters |= Q(product__category=category_value)

            filters &= category_filters

        if filter_price_min:
            filters &= Q(price__gte=filter_price_min)
        if filter_price_max:
            filters &= Q(price__lte=filter_price_max)
        productseller = ProductSeller.objects.filter(filters)

        # sorting
        if sort and sort in sort_fields:
            productseller = productseller.order_by(sort_fields[sort])

        # Pagination
        page = int(request.data.get("page")) if request.data.get("page") else 0
        per_page = (
            int(request.data.get("per_page")) if request.data.get("per_page") else 10
        )
        paginator = Paginator(productseller, per_page)
        total_count = paginator.count
        try:
            paginated_products = paginator.page(page + 1)
        except (PageNotAnInteger, EmptyPage):
            paginated_products = paginator.page(1)

        serializer = ProductSellerSerializer(paginated_products, many=True)

        return Response({"data": serializer.data, "total_count": total_count})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def update(request):
    try:
        _id = request.data.get("id")
        if _id is None:
            raise ValueError("Missing id")
        product_seller = ProductSeller.objects.get(id=_id)
        if product_seller is None:
            raise ValueError("ProductSeller not found")
        changed_fields = []
        product_name = request.data.get("product_name")
        if product_name is not None and product_name != product_seller.product_name:
            product_seller.product_name = product_name
            changed_fields.append("product_name")
        original_price = request.data.get("original_price")
        if (
            original_price is not None
            and original_price != product_seller.original_price
        ):
            product_seller.original_price = original_price
            changed_fields.append("original_price")
        discount_rate = request.data.get("discount_rate")
        if discount_rate is not None:
            discount_rate = Decimal(discount_rate).quantize(Decimal("0.00"))
            if discount_rate != product_seller.discount_rate:
                product_seller.discount_rate = discount_rate
                changed_fields.append("discount_rate")
                discount = original_price * discount_rate
                price = original_price * (1 - discount_rate)
                product_seller.discount = discount
                changed_fields.append("discount")
                product_seller.price = price
                changed_fields.append("price")
        in_stock = request.data.get("in_stock")
        if in_stock is not None and in_stock != product_seller.in_stock:
            product_seller.in_stock = in_stock
            changed_fields.append("in_stock")
        if changed_fields:
            product_seller.full_clean()
            product_seller.save(update_fields=changed_fields)
        return Response({"status": "success"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def delete(request):
    _id = request.data.get("id")
    try:
        product_seller = ProductSeller.objects.get(id=_id)
        # check to see if this seller is the only one selling this product
        if ProductSeller.objects.filter(product=product_seller.product).count() == 1:
            # delete the product as well
            product_seller.product.delete()
        else:
            product_seller.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def getSimilarProducts(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            raise Exception("Consumers cannot create products")
        elif user.type == "seller":
            threshold = 80
            # create a product_names array with all the product names where the user is nto a seller for the product
            product_names = []
            for product in Product.objects.all():
                if not ProductSeller.objects.filter(
                    product=product, seller=user
                ).exists():
                    product_names.append(product.name)

            user_product_name = request.data["name"]

            similar_products = []
            for product_name in product_names:
                similarity_score = fuzz.partial_ratio(user_product_name, product_name)
                if similarity_score >= threshold:
                    similar_products.append((product_name, similarity_score))

            # Sort similar products by similarity score
            similar_products.sort(key=lambda x: x[1], reverse=True)

            # only show the name
            similar_products = [product[0] for product in similar_products]
            return Response(similar_products, status=status.HTTP_200_OK)

    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def createSimilarProduct(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            raise Exception("Consumers cannot create products")
        elif user.type == "seller":
            product_name = request.data["product_name"]
            if product_name:
                # check if the seller already has a productseller entry for the product
                if ProductSeller.objects.filter(
                    product=Product.objects.get(name=product_name),
                    seller=user,
                ).exists():
                    # return it as a response error with a custom error message
                    return Response(
                        {"error": "Product already exists"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                ProductSeller.objects.create(
                    product=Product.objects.get(name=product_name),
                    seller=user,
                    price=request.data["price"],
                    discount=request.data["discount"],
                    discount_rate=request.data["discount_rate"],
                    original_price=request.data["original_price"],
                    product_url=request.data["product_url"],
                    in_stock=request.data["in_stock"],
                    img_array=request.data["img_array"],
                    product_name=product_name,
                ).save()
                # return the product
                serializer = ProductSellerSerializer(
                    ProductSeller.objects.get(
                        product=Product.objects.get(name=product_name), seller=user
                    )
                )
                print(serializer.data)
                return Response(
                    {"data": serializer.data}, status=status.HTTP_201_CREATED
                )
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def createNewProduct(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            raise Exception("Consumers cannot create products")
        elif user.type == "seller":
            product = Product.objects.create(
                name=request.data["name"],
                brand=request.data["brand"],
                category=request.data["category"],
                description=request.data["description"],
            )
            product.save()
            ProductSeller.objects.create(
                product=product,
                seller=user,
                price=request.data["price"],
                discount=request.data["discount"],
                discount_rate=request.data["discount_rate"],
                original_price=request.data["original_price"],
                product_url=request.data["product_url"],
                in_stock=request.data["in_stock"],
                img_array=request.data["img_array"],
                product_name=product.name,
            ).save()
            # return the product
            serializer = ProductSellerSerializer(
                ProductSeller.objects.get(
                    product=Product.objects.get(name=product.name), seller=user
                )
            )
            print(serializer.data)
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def download_format(request):
    try:
        file_path = os.path.join(settings.BASE_DIR, "inventory/resource/format.xlsx")
        response = FileResponse(
            open(file_path, "rb"),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = 'attachment; filename="format.xlsx"'
        return response
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def upload_bulk(request):
    try:
        data = request.data
        user = request.user
        # create a product_names array with all the product names where the user is nto a seller for the product
        product_names = []
        for product in Product.objects.all():
            if not ProductSeller.objects.filter(product=product, seller=user).exists():
                product_names.append(product.name)
        for item in data:
            img_array = [item[7]]
            if len(item) > 8 and item[8]:
                img_array.append(item[8])
            if len(item) > 9 and item[9]:
                img_array.append(item[9])
            created_product_seller = False
            for product_name in product_names:
                similarity_score = fuzz.partial_ratio(item[0], product_name)
                if similarity_score >= 90:
                    ProductSeller.objects.create(
                        product=Product.objects.get(name=product_name),
                        seller=user,
                        price=item[2],
                        discount=item[3],
                        discount_rate=item[4],
                        original_price=item[1],
                        product_url=item[5],
                        in_stock=item[6],
                        img_array=img_array,
                        product_name=product_name,
                    ).save()
                    created_product_seller = True  # Set the flag to True
                    break

            if created_product_seller:
                continue

            Product.objects.create(
                name=item[0],
                brand=item[12],
                category=item[11],
                description=item[10],
            ).save()
            ProductSeller.objects.create(
                product=Product.objects.get(name=item[0]),
                seller=user,
                price=item[2],
                discount=item[3],
                discount_rate=item[4],
                original_price=item[1],
                product_url=item[5],
                in_stock=item[6],
                img_array=img_array,
                product_name=item[0],
            ).save()

        return Response(
            {"message": "Data received successfully"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
