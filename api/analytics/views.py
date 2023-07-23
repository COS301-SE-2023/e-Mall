import statistics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Analytics
from django.http import JsonResponse
from django.db.models.functions import TruncMonth
from django.db.models import Q
from django.db.models import Count
from rest_framework.permissions import AllowAny
from datetime import timedelta, timezone
from django.utils.timezone import now
from django.db.models import Count, Case, When, Value, Q, IntegerField

# Create your views here.
# Date range options and their corresponding time deltas
date_range_options = {
    "1_year": timedelta(days=365),
    "6_months": timedelta(days=182),
    "30_days": timedelta(days=30),
    "7_days": timedelta(days=7),
    "1_day": timedelta(days=1),
}


class ProductAnalyticsAPIView(APIView):
    def get(self, request):
        seller_name = request.GET.get("seller_name")
        link_clicks = Analytics.objects.filter(
            seller=seller_name, event_type="link_click"
        ).count()
        product_clicks = Analytics.objects.filter(
            seller=seller_name, event_type="product_click"
        ).count()
        favourites = Analytics.objects.filter(
            seller=seller_name, event_type="favourited_product"
        ).count()

        response_data = {
            "product_clicks": product_clicks,
            "link_clicks": link_clicks,
            "favourites": favourites,

        }
        return Response(response_data)


class AllProductAnalyticsAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        seller_name = request.data.get("seller_name")

        product_clicks = (
            Analytics.objects.filter(seller=seller_name, event_type="product_click")
            .values("product")
            .annotate(clicks=Count("id"))
            .order_by(
                "-clicks", "product"
            )  # Sort by clicks in descending order and product name in ascending order
        )[
            :10
        ]  # Get the top ten most clicked products

        response_data = []
        for item in product_clicks:
            product_name = item["product"]
            clicks = item["clicks"]

            # Retrieve link_clicks for the current product
            link_clicks = Analytics.objects.filter(
                seller=seller_name, event_type="link_click", product=product_name
            ).count()

            # Retrieve favourites for the current product
            favourites = Analytics.objects.filter(
                seller=seller_name,
                event_type="favourited_product",
                product=product_name,
            ).count()

            # Append the data to the response list
            response_data.append(
                {
                    "product_name": product_name,
                    "clicks": clicks,
                    "link_clicks": link_clicks,
                    "favourites": favourites,
                }
            )

        return Response(response_data)


class CreateProductAnalyticsAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            analytics = Analytics(
                seller=request.data.get("seller"),
                product=request.data.get("product"),
                product_category=request.data.get("product_category"),
                consumer_id=request.data.get("consumer_id"),
                event_type=request.data.get("event_type"),
                metadata=request.data.get("metadata"),
                event_date=now(),
            )
            analytics.save()
            return Response(
                {"message": "Product Analytics created successfully"}, status=201
            )

        except Exception as e:
            return Response({"message": str(e)}, status=400)


class ConversionRateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        seller_name = request.GET.get("seller_name")
        products = (
            Analytics.objects.filter(seller=seller_name).values("product").distinct()
        )
        response_data = []
        for product in products:
            product_clicks = Analytics.objects.filter(
                event_type="product_click",
                product=product["product"],
            ).count()
            link_clicks = Analytics.objects.filter(
                seller=seller_name, event_type="link_click", product=product["product"]
            ).count()
            conversion_rate = 0
            if product_clicks > 0:
                conversion_rate = (link_clicks / product_clicks) * 100
                conversion_rate = round(min(conversion_rate, 100), 2)
                if conversion_rate > 0:
                    response_data.append(
                        {
                            "product_name": product["product"],
                            "conversion_rate": conversion_rate,
                        }
                    )
        return Response(response_data)


class categoryPercentageAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        seller_name = request.GET.get("seller_name")

        # Get the total number of product clicks for the seller
        total_product_clicks = Analytics.objects.filter(
            seller=seller_name, event_type="product_click"
        ).count()

        # Get the category clicks and their count for the seller
        category_clicks = (
            Analytics.objects.filter(seller=seller_name, event_type="product_click")
            .values("product_category")
            .annotate(count=Count("product_category"))
            .order_by("-count")
        )

        # Calculate the percentage for each category
        response_data = []
        for category in category_clicks:
            percentage = (category["count"] / total_product_clicks) * 100
            percentage = round(min(percentage, 100), 2)
            response_data.append(
                {"category": category["product_category"], "percentage": percentage}
            )

        return Response(response_data)


class selectedProductsAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        seller_name = request.data.get("seller_name")
        product_names = request.data.get("product_names")
        if request.data.get("date_range"):
            date_range = request.data.get("date_range")
        else:
            date_range = "1_year"

        # Define a dictionary to map date_range options to timedelta values
        date_range_options = {
            "1_year": timedelta(days=365),
            "6_months": timedelta(days=180),
            "30_days": timedelta(days=30),
            "7_days": timedelta(days=7),
            "1_day": timedelta(days=1),
        }

        # Get the timedelta for the selected date_range
        date_range_timedelta = date_range_options.get(date_range)

        # Calculate the start date based on the selected date_range
        end_date = now()
        start_date = end_date - date_range_timedelta

        # Query the Analytics data for the specified products and date range
        product_clicks = (
            Analytics.objects.filter(
                seller=seller_name,
                event_type="product_click",
                product__in=product_names,
                event_date__range=[start_date, end_date],
            )
            .annotate(month=TruncMonth("event_date"))
            .values("product", "month")
            .annotate(clicks=Count("id"))
            .order_by("product", "month")
        )

        # Group the clicks by product and month
        clicks_by_product = {}
        for item in product_clicks:
            product = item["product"]
            month = item["month"].strftime("%Y-%m")
            clicks = item["clicks"]

            if product not in clicks_by_product:
                clicks_by_product[product] = {}

            clicks_by_product[product][month] = clicks

        return Response(clicks_by_product)
