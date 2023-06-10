from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductSeller
from .serializers import ProductSellerSerializer


# Create your views here.
class ProductSellerFrontendAPIView(APIView):
    def get(self, request):
        productseller = ProductSeller.objects.all()
        productseller = productseller.order_by("price")
        serializer = ProductSellerSerializer(productseller, many=True)
        return Response(serializer.data)


class ProductSellerBackendAPIView(APIView):
    def get(self, request):
        # Input for search of a specific product
        prod_id = int(request.GET.get("prod_id")) if request.GET.get("prod_id") else 1

        # input for sort[price, discount]
        sort = request.GET.get("sort")

        productseller = ProductSeller.objects.all()

        if prod_id:
            productseller = productseller.filter(product_id=prod_id)

        if sort == "price":
            productseller = productseller.order_by("price")
        elif sort == "discount":
            productseller = productseller.order_by("-discount_rate")

        serializer = ProductSellerSerializer(productseller, many=True)
        return Response(serializer.data)
