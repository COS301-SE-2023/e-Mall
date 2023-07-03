from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductSeller
from .serializers import ProductSellerSerializer
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


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


class ProductSellerDashboardAPIView(APIView):
    def get(self, request):
        seller_name = (
            int(request.GET.get("seller_name"))
            if request.GET.get("seller_name")
            else "Takealot"
        )
        # sorting options[price, discount, name]
        sort = request.GET.get("sort")

        # filter options[in stock, price, category]
        filter_in_stock = request.GET.get("filter_in_stock")
        filter_category = request.GET.get("filter_category")
        filter_price_min = request.GET.get("filter_price_min")
        filter_price_max = request.GET.get("filter_price_max")

        # Pagination
        page = int(request.GET.get("page")) if request.GET.get("page") else 0
        per_page = (
            int(request.GET.get("per_page")) if request.GET.get("per_page") else 10
        )

        # Filtering of the products
        productseller = ProductSeller.objects.filter(seller__business_name=seller_name)

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
        paginator = Paginator(productseller, per_page)
        total_count = paginator.count
        try:
            paginated_products = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            paginated_products = paginator.page(1)

        serializer = ProductSellerSerializer(paginated_products, many=True)
        return Response({"data": serializer.data, "total_count": total_count})

        # productseller = ProductSeller.objects.filter(seller__business_name=seller_name)
        # serializer = ProductSellerSerializer(productseller, many=True)
        # return Response(serializer.data)
