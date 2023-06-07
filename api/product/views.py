from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Product
from .serializers import ProductSerializer

from rest_framework.pagination import PageNumberPagination

class ProductList(APIView):
    # Pagination settings
    pagination_class = PageNumberPagination
    page_size = 10

    def get(self, request):
        # Retrieve query parameters
        search_query = request.query_params.get('search', '')

        # Apply search filter
        queryset = Product.objects.filter(name__icontains=search_query)

        # Paginate the queryset
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        # Serialize the paginated results
        serializer = ProductSerializer(paginated_queryset, many=True)

        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

