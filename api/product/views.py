from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Product
from .serializers import ProductSerializer
import math
from django.utils.dateparse import parse_date
from rest_framework.pagination import PageNumberPagination


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
        filter_date_min = request.GET.get("filter_date_min")
        filter_date_max = request.GET.get("filter_date_max")
        filter_seller = request.GET.get("filter_seller")
        filter_in_stock = request.GET.get("filter_in_stock")

        # Pagination
        page = int(request.GET.get("page")) if request.GET.get("page") else 0
        per_page = (
            int(request.GET.get("per_page")) if request.GET.get("per_page") else 10
        )

        # Default
        products = any

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

        if filter_date_min and filter_date_max:
            date_min = parse_date(filter_date_min)
            date_max = parse_date(filter_date_max)
            filters &= Q(created_at__gte=date_min, created_at__lte=date_max)
        elif filter_date_min:
            date_min = parse_date(filter_date_min)
            filters &= Q(created_at__gte=date_min)
        elif filter_date_max:
            date_max = parse_date(filter_date_max)
            filters &= Q(created_at__lte=date_max)
        if filter_seller:
            seller_values = filter_seller.split(
                ","
            )  # Split the filter_sellers value by comma

            seller_filters = Q()  # Create a separate Q object for seller filters

            for seller_value in seller_values:
                seller_filters |= Q(
                    productseller__seller__icontains=seller_value.strip()
                )  # Apply seller filter for each seller value

            filters &= seller_filters
        if filter_in_stock:
            filters &= Q(productseller__in_stock=True)

        products = products.filter(filters)

        # Sorting
        # all in asc order(small to big)
        if sort == "price":
            products = products.order_by("productseller__price")
        elif sort == "name":
            products = products.order_by("name")
        elif sort == "-price":
            # sort by desc order(big to small)
            products = products.order_by("-productseller__price")
        elif sort == "-name":
            products = products.order_by("-name")
        elif sort == "discount":
            products = products.order_by("-productseller__discount_rate")

        # Pagination
        paginator = Paginator(products, per_page)
        total_count = paginator.count
        try:
            paginated_products = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            paginated_products = paginator.page(1)

        serializer = ProductSerializer(paginated_products, many=True)
        return Response({"data": serializer.data, "total_count": total_count})
