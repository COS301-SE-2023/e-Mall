from datetime import datetime, timedelta
from django.http import HttpResponseBadRequest
from django.shortcuts import render
from analytics.models import Analytics
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import Product
from .serializers import ProductSerializer
from django.utils.dateparse import parse_date
from django.db.models import Subquery, OuterRef, Min
from productseller.models import ProductSeller
from django.core import serializers
from fuzzywuzzy import fuzz
from rest_framework.decorators import api_view, permission_classes


from django.forms.models import model_to_dict

from decimal import Decimal



class ProductFrontendAPIView(APIView):
    def get(self, request):
        products = Product.objects.all()
        # Input for specific product
        prod_id = request.GET.get("prod_id")
        # Specific product
        if prod_id:
            products = products.filter(id=prod_id)
            serializer = ProductSerializer(products[0])
            return Response(serializer.data)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductBackendAPIView(APIView):
    def get(self, request):
        # Input for search
        search = request.GET.get("search")

        # Input for sort[brand, price, name]
        sort = request.GET.get("sort")

        # Input for filter[brand, price range, category, date range, seller]
        filter_brand = request.GET.get("filter_brand")
        filter_price_min = request.GET.get("filter_price_min")
        filter_price_max = request.GET.get("filter_price_max")
        filter_category = request.GET.get("filter_category")
        # filter_date_min = request.GET.get("filter_date_min")
        # filter_date_max = request.GET.get("filter_date_max")
        filter_seller = request.GET.get("filter_seller")
        filter_in_stock = request.GET.get("filter_in_stock")

        # Pagination
        page = int(request.GET.get("page")) if request.GET.get("page") else 0
        per_page = (
            int(request.GET.get("per_page")) if request.GET.get("per_page") else 10
        )

        # Default
        products = Product.objects.all()

        # Searching the DB and returning the relevant products based on the search query
        if search:
            products = Product.objects.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(brand__icontains=search)
                | Q(category__icontains=search)
            )

        # Apply filters
        filters = Q()
        # Filtering by brand
        if filter_brand:
            brand_values = filter_brand.split(
                ","
            )  # Split the filter_brand value by comma

            brand_filters = Q()  # Create a separate Q object for brand filters

            for brand_value in brand_values:
                brand_filters |= Q(
                    brand__icontains=brand_value.strip()
                )  # Apply brand filter for each brand value

            filters &= brand_filters

        if filter_price_min and filter_price_max:
            filters &= Q(
                productseller__price__gte=filter_price_min,
                productseller__price__lte=filter_price_max,
            )
        elif filter_price_min:
            filters &= Q(productseller__price__gte=filter_price_min)
        elif filter_price_max:
            filters &= Q(productseller__price__lte=filter_price_max)
        if filter_category:
            categories_values = filter_category.split(
                ","
            )  # Split the filter_categories value by comma

            category_filters = Q()  # Create a separate Q object for category filters

            for category_value in categories_values:
                category_filters |= Q(
                    category__icontains=category_value.strip()
                )  # Apply category filter for each category value

            filters &= category_filters

        # if filter_date_min and filter_date_max:
        #     date_min = parse_date(filter_date_min)
        #     date_max = parse_date(filter_date_max)
        #     filters &= Q(created_at__gte=date_min, created_at__lte=date_max)
        # elif filter_date_min:
        #     date_min = parse_date(filter_date_min)
        #     filters &= Q(created_at__gte=date_min)
        # elif filter_date_max:
        #     date_max = parse_date(filter_date_max)
        #     filters &= Q(created_at__lte=date_max)
        if filter_seller:
            seller_values = filter_seller.split(
                ","
            )  # Split the filter_sellers value by comma

            seller_filters = Q()  # Create a separate Q object for seller filters

            for seller_value in seller_values:
                seller_filters |= Q(
                    productseller__seller__business_name__icontains=seller_value.strip()
                )  # Apply seller filter for each seller value

            filters &= seller_filters
        if filter_in_stock:
            filters &= Q(productseller__in_stock=True)

        products = products.filter(filters)

        # Sorting
        # all in asc order(small to big)
        if sort == "name":
            products = products.order_by("name")
        elif sort == "-price":
            # sort by desc order(big to small)
            products = products.order_by("-productseller__price")
        elif sort == "-name":
            products = products.order_by("-name")
        elif sort == "discount":
            products = products.order_by("-productseller__discount_rate")
        else:
            products = products.order_by("productseller__price")

        # Pagination
        serializer = ProductSerializer(products, many=True)
        paginator = Paginator(products, per_page)
        total_count = paginator.count
        try:
            paginated_products = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            paginated_products = paginator.page(1)

        serializer = ProductSerializer(paginated_products, many=True)

        return Response({"data": serializer.data, "total_count": total_count})


class ProductTestAPIView(APIView):
    def get(self, request):
        # set sort fileds map
        sort_fields = {
            "id": "id",
            "-id": "-id",
            "name": "name",
            "-name": "-name",
            "brand": "brand",
            "-brand": "-brand",
            "price": "min_price",
            "-price": "-min_price",
            "discount": "min_price_discount_rate",
            "-discount": "-min_price_discount_rate",
        }

        # Input for search
        search = request.GET.get("search", "")
        if search == "":
            return Response({"data": [], "total_count": 0})

        # Input for sort[brand, price, name]
        sort = request.GET.get("sort")
        if sort is None:
            sort = "price"
        # Input for filter[brand, price range, category, date range, seller]
        filter_brand = request.GET.get("filter_brand")
        filter_price_min = request.GET.get("filter_price_min")
        filter_price_max = request.GET.get("filter_price_max")
        filter_category = request.GET.get("filter_category")
        filter_seller = request.GET.get("filter_seller")
        filter_in_stock = request.GET.get("filter_in_stock")
        if filter_price_min and filter_price_max:
            _min = 0
            _max = 0
            try:
                _min = int(filter_price_min)
                _max = int(filter_price_max)
            except ValueError:
                _min = float(filter_price_min)
                _max = float(filter_price_max)
            if _min > _max:
                return HttpResponseBadRequest("invalid price range")

        products = {}

        min_price_seller = ProductSeller.objects.filter(
            product=OuterRef("pk")
        ).order_by("price")

        products = Product.objects.annotate(
            min_price_original_price=(min_price_seller.values("original_price")[:1]),
            min_price_discount=(min_price_seller.values("discount")[:1]),
            min_price_discount_rate=(min_price_seller.values("discount_rate")[:1]),
            min_price=(min_price_seller.values("price")[:1]),
            min_price_seller_id=(min_price_seller.values("seller")[:1]),
            min_price_seller_product_url=(min_price_seller.values("product_url")[:1]),
            min_price_seller_business_name=(
                min_price_seller.values("seller__business_name")[:1]
            ),
            min_price_in_stock=(min_price_seller.values("in_stock")[:1]),
            min_price_img_array=(min_price_seller.values("img_array")[:1]),
        )

        query = Q(name__icontains=search)

        if filter_brand:
            query &= self.build_query_from_list(filter_brand, "brand")
        if filter_category:
            query &= self.build_query_from_list(filter_category, "category")

        if filter_seller:
            query &= self.build_query_from_list(
                filter_seller, "min_price_seller_business_name"
            )

        if filter_price_min:
            query &= Q(min_price__gte=Decimal(filter_price_min))

        if filter_price_max:
            query &= Q(min_price__lte=Decimal(filter_price_max))

        if filter_in_stock:
            query &= Q(min_price_in_stock=True)

        products = products.filter(query).order_by(sort_fields[sort])
        data = []
        for product in products:
            product_data = model_to_dict(product)
            product_data.update(
                {
                    "min_price_original_price": product.min_price_original_price,
                    "min_price_discount": product.min_price_discount,
                    "min_price_discount_rate": product.min_price_discount_rate,
                    "min_price": product.min_price,
                    "min_price_seller_id": product.min_price_seller_id,
                    "min_price_seller_product_url": product.min_price_seller_product_url,
                    "min_price_seller_business_name": product.min_price_seller_business_name,
                    "min_price_in_stock": product.min_price_in_stock,
                    "min_price_img_array": product.min_price_img_array,
                }
            )
            data.append(product_data)

        # Pagination

        page = int(request.GET.get("page")) if request.GET.get("page") else 0
        per_page = (
            int(request.GET.get("per_page")) if request.GET.get("per_page") else 10
        )

        start = (page) * per_page
        end = start + per_page
        total_count = len(data)
        paginated_data = data[start:end]

        return Response({"data": paginated_data, "total_count": total_count})

    def build_query_from_list(self, _param, field):
        _query = Q()
        _list = _param.split(",,,")
        for keyword in _list:
            keyword = keyword.strip()
            _query |= Q(**{f"{field}__icontains": keyword})
        return _query


class GetPopularProductsAPIView(APIView):
    def get(self, request):
        # Get the most popular products names based on clicks
        top_products = (
            Analytics.objects.filter(
                event_type="product_click",
            )
            .values("product")
            .annotate(click_count=Count("product"))
            .order_by("-click_count")[:12]  # Get top 10 products
        )

        # Extract product names from the queryset
        top_products_names = [product["product"] for product in top_products]

        # Fetch the actual Product objects from the database
        products = Product.objects.filter(name__in=top_products_names)

        # Serialize the products
        serializer = ProductSerializer(
            products, many=True
        )  # Assuming you have a ProductSerializer

        return Response(serializer.data)

class GetTrendingProductsAPIView(APIView):
    def get(self, request):
        # Define the time frame for trending products (e.g., the last week)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)  # Change this time frame as needed

        # Get the most viewed products in the defined time frame
        trending_products = (
            Analytics.objects.filter(
                event_type="product_click",
                event_date__gte=start_date,
                event_date__lte=end_date,
        )
            .values("product")
            .annotate(view_count=Count("product"))
            .order_by("-view_count")[:12]  # Get top 10 trending products
        )

        # Extract product names from the queryset
        trending_products_names = [product["product"] for product in trending_products]

        # Fetch the actual Product objects from the database
        products = Product.objects.filter(name__in=trending_products_names)

        # Serialize the trending products
        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data)


class CreateAPIView(APIView):
    def post(self, request):
        try:
            user = request.user
            if user is None:
                raise Exception("User not found")
            if user.type == "consumer":
                raise Exception("Consumers cannot create products")
            elif user.type == "seller":
                threshold = 80
                # create a product_names array with all the product names
                product_names = Product.objects.values_list("name", flat=True)
                user_product_name = request.data["name"]

                similar_products = []
                for product_name in product_names:
                    similarity_score = fuzz.partial_ratio(
                        user_product_name, product_name
                    )
                    if similarity_score >= threshold:
                        similar_products.append((product_name, similarity_score))

                # Sort similar products by similarity score
                similar_products.sort(key=lambda x: x[1], reverse=True)

                if similar_products:
                    # check if the seller already has a productseller entry for the product
                    if ProductSeller.objects.filter(
                        product=Product.objects.get(name=similar_products[0][0]),
                        seller=user,
                    ).exists():
                        raise Exception(
                            "You already have a product with the same name in the database"
                        )

                    ProductSeller.objects.create(
                        product=Product.objects.get(name=similar_products[0][0]),
                        seller=user,
                        price=request.data["price"],
                        discount=request.data["discount"],
                        discount_rate=request.data["discount_rate"],
                        original_price=request.data["original_price"],
                        product_url=request.data["product_url"],
                        in_stock=request.data["in_stock"],
                        img_array=request.data["img_array"],
                    ).save()

                    return Response(
                        "ProductSeller relation created successfully",
                        status=status.HTTP_201_CREATED,
                    )

                else:
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
                        product_name=request.data["name"],
                    ).save()
                return Response(
                    "Product and productseller relation created successfully",
                    status=status.HTTP_201_CREATED,
                )

        except Exception as e:
            # handle other exceptions here
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
