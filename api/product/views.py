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
from django.db.models import Subquery, OuterRef, Min
from productseller.models import ProductSeller


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
            int(request.GET.get("per_page")) if request.GET.get(
                "per_page") else 10
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
            print("passing here")
            products = products.order_by("-productseller__discount_rate")

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
        prod_seller_fields = {
            'price': 'price',
            '-price': '-price',
            'discount': 'discount_rate',
            '-discount': '-discount_rate'
        }
        prod_fields = {
            'id': 'id',
            '-id': '-id',
            'name': 'name',
            '-name': '-name',
            'brand': 'brand',
            '-brand': '-brand'
        }
        # Input for search
        search = request.GET.get("search")

        # Input for sort[brand, price, name]
        sort = request.GET.get("sort")

        # empty products
        products = {}
        # if sort is on productSeller field
        if (sort in prod_seller_fields):
            subquery = Subquery(ProductSeller.objects.filter(
                product=OuterRef('pk')).order_by('price').values(prod_seller_fields[sort].lstrip('-'))[:1])
            # search products by 'search' and get each of them's min priced productSeller.
            # then sort resulting products by 'sort' on productSeller's field
            products = Product.objects.annotate(
                min_seller=Subquery(ProductSeller.objects.filter(
                    product=OuterRef('pk')).order_by('price').values('id')[:1]),
                sort_field=subquery
            ).filter(name__icontains=search).order_by('sort_field')
        # else if sort is on product field
        elif (sort in prod_fields):
            # search products by 'search' and get each of them's min priced productSeller.
            # then sort resulting products by 'sort' on product's field
            products = Product.objects.annotate(
                min_seller=Subquery(ProductSeller.objects.filter(
                    product=OuterRef('pk')).order_by('price').values('id')[:1])
            ).filter(name__icontains=search).order_by(prod_fields[sort])

        # to mock serializer.data look
        serializer = {"data": []}
        serializer["data"] = create_response_data(products)

        # for page i guess
        total_count = 1
        return Response({"data": serializer["data"], "total_count": total_count})


def create_response_data(products):
    response_data = []
    for product in products:
        product_data = {}
        for field, value in product.__dict__.items():
            if not field.startswith('_'):
                product_data[field] = value

        min_price_product_seller = ProductSeller.objects.filter(
            id=product.min_seller).first()
        if min_price_product_seller:
            product_seller_data = {}
            for field, value in min_price_product_seller.__dict__.items():
                if not field.startswith('_'):
                    product_seller_data[field] = value
            product_data['product_seller'] = product_seller_data

        response_data.append(product_data)
    return response_data
