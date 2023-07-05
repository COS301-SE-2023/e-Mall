from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductSeller
from .serializers import ProductSellerSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny


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
        filter_in_stock = request.GET.get("filter_in_stock")

        if sort is None:
            sort = "price"
        productseller = ProductSeller.objects.all()

        if prod_id:
            productseller = productseller.filter(product_id=prod_id)
        if filter_in_stock:
            productseller = productseller.filter(in_stock=True)
        if sort == "price":
            productseller = productseller.order_by("price")
        elif sort == "discount":
            productseller = productseller.order_by("-discount_rate")

        serializer = ProductSellerSerializer(productseller, many=True)
        return Response(serializer.data)


class ProductSellerProdUpdateAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        prod_id = request.data.get("prod_id")
        seller_name = request.data.get("seller_name")
        try:
            # Fetch the ProductSeller object based on prod_id and seller_name
            productseller = ProductSeller.objects.get(
                seller__business_name=seller_name, product__id=prod_id
            )

            # Update the fields of the ProductSeller object
            productseller.original_price = request.data.get(
                "original_price", productseller.original_price
            )
            productseller.price = request.data.get("price", productseller.price)
            productseller.discount = request.data.get(
                "discount", productseller.discount
            )
            productseller.discount_rate = request.data.get(
                "discount_rate", productseller.discount_rate
            )
            productseller.in_stock = request.data.get(
                "in_stock", productseller.in_stock
            )

            # Save the updated ProductSeller object
            productseller.save()

            # Return a success response
            return JsonResponse(
                {"message": "ProductSeller details updated successfully"}
            )

        except ProductSeller.DoesNotExist:
            return JsonResponse({"error": "ProductSeller not found"}, status=404)

class ProductSellerProdDeleteAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        prod_id = request.data.get("prod_id")
        seller_name = request.data.get("seller_name")
        try:
            # Fetch the ProductSeller object based on prod_id and seller_name
            productseller = ProductSeller.objects.get(
                seller__business_name=seller_name, product__id=prod_id
            )

            # Delete the ProductSeller object
            productseller.delete()

            # Return a success response
            return JsonResponse(
                {"message": "ProductSeller deleted successfully"}
            )

        except ProductSeller.DoesNotExist:
            return JsonResponse({"error": "ProductSeller not found"}, status=404)