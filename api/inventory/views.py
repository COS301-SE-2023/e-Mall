from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from productseller.models import ProductSeller
from productseller.serializers import ProductSellerSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from decimal import Decimal


@api_view(["POST"])
@permission_classes([AllowAny])
def getProd(request):
    try:
        user = request.user
        seller_name = user.username

        # # remove this later
        #seller_name = "Takealot"

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
        print(filters)
        # searching
        if search and len(search) > 0:
            print("Searching", search, search_option)
            if search_option == "id":
                if not search.isnumeric():
                    return Response({"data": [], "total_count": 0})

                filters &= Q(product__id=search)
            elif search_option == "category":
                filters &= Q(product__category__icontains=search)
            else:
                filters &= Q(product__name__icontains=search)

        if filter_in_stock is not None:
            print(" filter_in_stock", filter_in_stock)
            filters &= Q(in_stock=filter_in_stock)
        if filter_category:
            print(" filter_category", filter_category)

            categories_values = filter_category.split(
                ",,,"
            )  # Split the filter_categories value by comma

            category_filters = Q()  # Create a separate Q object for category filters

            for category_value in categories_values:
                category_filters |= Q(product__category=category_value)

            filters &= category_filters

        if filter_price_min:
            print(" filter_price_min", filter_price_min)
            filters &= Q(price__gte=filter_price_min)
        if filter_price_max:
            print(" filter_price_max", filter_price_max)
            filters &= Q(price__lte=filter_price_max)
        print(filters)
        productseller = ProductSeller.objects.filter(filters)

        # sorting
        if sort and sort in sort_fields:
            print(" sort", sort)
            productseller = productseller.order_by(sort_fields[sort])

        # Pagination
        print(request.data)
        page = int(request.data.get("page")) if request.data.get("page") else 0
        per_page = (
            int(request.data.get("per_page")) if request.data.get("per_page") else 10
        )
        print(page, per_page)
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
        product_seller.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
