from django.db.models import Count
from itertools import count
from django.shortcuts import render
from product.models import Product
from product.serializers import ProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductSeller
from .serializers import ProductSellerSerializer
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from analytics.models import Analytics
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes


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
        def calculate_current_price(original_price, discount_rate):
            """
            Calculates the current price based on the original price and discount rate.
            """
            original_price = Decimal(original_price)
            discount_rate = Decimal(discount_rate)

            discount = original_price * (discount_rate)
            current_price = original_price - discount
            return current_price

        def calculate_discount_value(original_price, discount_rate):
            """
            Calculates the discount value based on the original price and discount rate.
            """
            original_price = Decimal(original_price)
            discount_rate = Decimal(discount_rate)

            discount = original_price * (discount_rate / 100)
            return discount

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

            # Calculate the current price and discount value
            productseller.price = calculate_current_price(
                productseller.original_price, productseller.discount_rate
            )
            productseller.discount = calculate_discount_value(
                productseller.original_price, productseller.discount_rate
            )
            productseller.discount_rate = request.data.get(
                "discount_rate", productseller.discount_rate
            )
            productseller.in_stock = request.data.get(
                "in_stock", productseller.in_stock
            )

            productseller.product_name = request.data.get(
                "product_name", productseller.product_name
            )

            # productseller.product_category = request.data.get(
            #     "product_category", productseller.product_category
            # )

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
            return JsonResponse({"message": "ProductSeller deleted successfully"})

        except ProductSeller.DoesNotExist:
            return JsonResponse({"error": "ProductSeller not found"}, status=404)


class ProductSellerDashboardAPIView(APIView):
    def get(self, request):
        seller_name = request.GET.get("seller_name")
        print("Seller name", seller_name)
        # Input for search
        search = request.GET.get("search")
        # sorting options[price, discount, name]
        sort = request.GET.get("sort")

        # filter options[in stock, price, category]
        filter_category = request.GET.get("filter_category")
        # Filtering of the products
        filters = Q(seller__business_name=seller_name)

        # searching
        if search:
            if search.isnumeric():
                filters &= Q(product__id=search)
            else:
                filters &= Q(product__name__icontains=search)

        if filter_category:
            print("gettiong here")
            categories_values = filter_category.split(
                ",,,"
            )  # Split the filter_categories value by comma
            print(categories_values)
            category_filters = Q()  # Create a separate Q object for category filters

            for category_value in categories_values:
                category_filters |= Q(
                    product__category__icontains=category_value.strip()
                )  # Apply category filter for each category value
            filters &= category_filters
            print(filters)
        productseller = ProductSeller.objects.filter(filters)

        # sorting
        if sort == "price":
            productseller = productseller.order_by("price")
        elif sort == "-price":
            productseller = productseller.order_by("-price")
        elif sort == "discount":
            productseller = productseller.order_by("-discount")
        elif sort == "-discount":
            productseller = productseller.order_by("discount")
        elif sort == "name":
            productseller = productseller.order_by("product__name")
        elif sort == "-name":
            productseller = productseller.order_by("-product__name")

        # Pagination
        page = int(request.GET.get("page")) if request.GET.get("page") else 0
        per_page = (
            int(request.GET.get("per_page")) if request.GET.get("per_page") else 10
        )
        paginator = Paginator(productseller, per_page)
        total_count = paginator.count
        try:
            paginated_products = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            paginated_products = paginator.page(1)

        serializer = ProductSellerSerializer(paginated_products, many=True)
        return Response({"data": serializer.data, "total_count": total_count})
