from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from productseller.models import ProductSeller
from productseller.serializers import ProductSellerSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny

from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from decimal import Decimal


@api_view(["POST"])
def get(request):
    try:
        user = request.user
        seller_name = user.username

        # remove this later
        seller_name = "Takealot"

        search = request.data.get("search")

        # sorting options[price, discount, name]
        sort_fields = {
            "name": "product__name",
            "-name": "-product__name",
            "price": "price",
            "-price": "-price",
            "discount": "discount",
            "-discount": "-discount",
        }

        sort = request.data.get("sortOption")

        # filter options[in stock, price, category]
        filter_options = request.data.get("filterOptions")

        filter_fields_list = {
            "all": None,
            "in": True,
            "out": False,
        }

        filter_in_stock = filter_fields_list[filter_options.get("filter_in_stock")]

        filter_category = filter_options.get("filter_category")
        filter_price_min = filter_options.get("filter_price_min")
        filter_price_max = filter_options.get("filter_price_max")

        # Filtering of the products
        filters = Q(seller__business_name=seller_name)
        print(filters)
        # searching
        if search and len(search) > 0:
            print("Searching")
            if search.isnumeric():
                filters &= Q(product__id=search)
            else:
                filters &= Q(product__name__icontains=search)

        if filter_in_stock is not None:
            print(" filter_in_stock", filter_in_stock)
            filters &= Q(in_stock=filter_in_stock)
        if filter_category:
            print(" filter_category", filter_category)

            categories_values = filter_category.split(
                ",,,"
            )  # Split the filter_categories value by comma

            category_filters = Q()  # Create a separate Q object for category filters

            for category_value in categories_values:
                category_filters |= Q(product__category=category_value)

            filters &= category_filters

        if filter_price_min:
            print(" filter_price_min", filter_price_min)
            filters &= Q(price__gte=filter_price_min)
        if filter_price_max:
            print(" filter_price_max", filter_price_max)
            filters &= Q(price__lte=filter_price_max)
        print(filters)
        productseller = ProductSeller.objects.filter(filters)

        # sorting
        if sort and sort in sort_fields:
            print(" sort", sort)
            productseller = productseller.order_by(sort_fields[sort])

        # Pagination
        print(request.data)
        page = int(request.data.get("page")) if request.data.get("page") else 0
        per_page = (
            int(request.data.get("per_page")) if request.data.get("per_page") else 10
        )
        print(page, per_page)
        paginator = Paginator(productseller, per_page)
        total_count = paginator.count
        try:
            paginated_products = paginator.page(page + 1)
        except (PageNotAnInteger, EmptyPage):
            paginated_products = paginator.page(1)

        serializer = ProductSellerSerializer(paginated_products, many=True)

        return Response({"data": serializer.data, "total_count": total_count})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
