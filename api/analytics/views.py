from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Analytics
from django.db.models import Count
from rest_framework.permissions import AllowAny
from django.utils.timezone import now
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from datetime import datetime, timedelta
from django.db.models.functions import (
    TruncHour,
    TruncDay,
    TruncMonth,
    TruncYear,
    TruncMinute,
    TruncSecond,
    TruncWeek,
)

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

        # Filter the Analytics data based on the seller_name
        product_clicks = (
            Analytics.objects.filter(
                seller=seller_name,
                event_type="product_click",
            )
            .values("product")
            .annotate(clicks=Count("id"))
            .order_by("-clicks", "product")
        )

        # Perform searching if a product_name is provided
        search = request.data.get("search")
        if search is not None:
            product_clicks = product_clicks.filter(product__icontains=search)
        # Perform pagination
        page = (
            int(request.data.get("current_page"))
            if request.data.get("current_page")
            else 1
        )
        per_page = (
            int(request.data.get("page_size")) if request.data.get("page_size") else 10
        )
        print(page)
        print(per_page)
        paginator = Paginator(product_clicks, per_page)
        try:
            paginated_products = paginator.page(page)
        except PageNotAnInteger:
            paginated_products = paginator.page(1)

        response_data = []
        for item in paginated_products:
            product_name = item["product"]
            clicks = item["clicks"]

            # Retrieve link_clicks for the current product
            link_clicks = Analytics.objects.filter(
                seller=seller_name,
                event_type="link_click",
                product=product_name,
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
        # Sort the response data
        sort = request.data.get("sort")
        if sort is not None:
            if sort == "product_name":
                response_data = sorted(response_data, key=lambda k: k[sort])
            else:
                response_data = sorted(
                    response_data, key=lambda k: k[sort], reverse=True
                )
        else:
            response_data = sorted(response_data, key=lambda k: k["product_name"])
        return Response({"data": response_data, "total_count": paginator.count})


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
        start_date_str = request.data.get("start_date")
        end_date_str = request.data.get("end_date")
        period = request.data.get("period")

        # Parse start_date and end_date from strings
        if start_date_str:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        else:
            start_date = datetime.strptime("2023-03-10", "%Y-%m-%d")

        if end_date_str:
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
        else:
            end_date = datetime.now()

        # Apply the specified period (if provided)
        if period == "1_day":
            date_format = "%H:%M:%S"
            trunc_unit = TruncHour("event_date")
        elif period == "7_days":
            date_format = "%A %Y-%m-%d"  # Day of the week and date
            trunc_unit = TruncDay("event_date")
        elif period == "30_days":
            date_format = "%d"  # Only the day of the month
            trunc_unit = TruncDay("event_date")
        elif period == "6_months":
            date_format = "%B"  # Only the full month name
            trunc_unit = TruncMonth("event_date")
        elif period == "1_year":
            date_format = "%Y"  # Only the year
            trunc_unit = TruncYear("event_date")
        else:
            # Handle invalid period option here (optional)
            return Response({"error": "Invalid period option."})

        # Query the Analytics data for the specified products and date range
        product_clicks = (
            Analytics.objects.filter(
                seller=seller_name,
                event_type="product_click",
                product__in=product_names,
                event_date__range=[start_date, end_date],
            )
            .annotate(interval=trunc_unit)
            .values("product", "interval")
            .annotate(clicks=Count("id"))
            .order_by("product", "interval")
        )

        # Group the clicks by product and interval (hour, day, week, month, year)
        clicks_by_product = {}
        for item in product_clicks:
            product = item["product"]
            interval = item["interval"]
            clicks = item["clicks"]

            interval_str = interval.strftime(date_format)

            if product not in clicks_by_product:
                clicks_by_product[product] = {}

            clicks_by_product[product][interval_str] = clicks

        sorted_clicks_by_product = dict(sorted(clicks_by_product.items(), reverse=True))

        return Response(sorted_clicks_by_product)
