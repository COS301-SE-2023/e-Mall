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

from rest_framework.pagination import PageNumberPagination


class ProductFrontendAPIView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductBackendAPIView(APIView):
    def get(self, request):
        # Input for search
        search = request.GET.get("search")

        # Input for sort[brand, price, name]
        sort = request.GET.get("sort")

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

        # Sorting
        # all in asc order(big to small)
        if sort == "brand":
            products = products.order_by("brand")
        elif sort == "price":
            products = products.order_by("price")
        elif sort == "name":
            products = products.order_by("name")
        elif sort == "-price":
            # sort by desc order(small to big)
            products = products.order_by("-price")
        elif sort == "-name":
            products = products.order_by("-name")
        elif sort == "-brand":
            products = products.order_by("-brand")

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
