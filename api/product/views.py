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
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductBackendAPIView(APIView):
    def get(self, request):
        # Input for specific product
        prod_id = request.GET.get("prod_id")

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

        # Pagination
        page = int(request.GET.get("page")) if request.GET.get("page") else 1
        per_page = 10

        products = Product.objects.all()

        # Searching
        if search:
            products = products.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(brand__icontains=search)
                | Q(category__icontains=search)
            )

        # Filtering
        if filter_brand:
            products = products.filter(brand__icontains=filter_brand)

        if filter_price_min:
            products = products.filter(productseller__price__gte=filter_price_min)

        if filter_price_max:
            products = products.filter(productseller__price__lte=filter_price_max)

        if filter_category:
            products = products.filter(category=filter_category)

        if filter_date_min:
            date_min = parse_date(filter_date_min)
            products = products.filter(created_at__gte=date_min)

        if filter_date_max:
            date_max = parse_date(filter_date_max)
            products = products.filter(created_at__lte=date_max)

        if filter_seller:
            products = products.filter(seller=filter_seller)

        # Sorting
        # all in asc order(small to big)
        if sort == "brand":
            products = products.order_by("brand")
        elif sort == "price":
            products = products.order_by("productseller__price")
        elif sort == "name":
            products = products.order_by("name")
        elif sort == "-price":
            # sort by desc order(big to small)
            products = products.order_by("-productseller__price")
        elif sort == "-name":
            products = products.order_by("-name")
        elif sort == "-brand":
            products = products.order_by("-brand")

        # Specific product
        if prod_id:
            products = products.filter(id=prod_id)
            serializer = ProductSerializer(products[0])
            return Response(serializer.data)
        # Pagination
        total = products.count()
        start = (page - 1) * per_page
        end = page * per_page

        serializer = ProductSerializer(products[start:end], many=True)
        return Response(
            {
                "data": serializer.data,
                "total": total,
                "page": page,
                "last_page": math.ceil(total / per_page),
            }
        )
