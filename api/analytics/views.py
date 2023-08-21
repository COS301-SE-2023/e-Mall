from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Analytics
from django.db.models import Count
from rest_framework.permissions import AllowAny
from django.utils.timezone import now
from django.core.paginator import Paginator, PageNotAnInteger
from datetime import datetime, timedelta
from django.db.models.functions import (
    TruncHour,
    TruncDay,
    TruncMonth,
    TruncYear,
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
                consumer_email=request.data.get("consumer_email"),
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
        start_date = (
            datetime.strptime(start_date_str, "%Y-%m-%d")
            if start_date_str
            else datetime.strptime("2023-03-10", "%Y-%m-%d")
        )
        end_date = (
            datetime.strptime(end_date_str, "%Y-%m-%d")
            if end_date_str
            else datetime.now()
        )
        current_day_of_week = end_date.strftime("%A")

        # Define date formats and trunc_units for each period
        period_settings = {
            "1_day": {
                "date_format": "%A : %H-%M-%S",
                "trunc_unit": TruncHour("event_date"),
            },
            "7_days": {
                "date_format": "%A %Y-%m-%d",
                "trunc_unit": TruncDay("event_date"),
            },
            "30_days": {
                "date_format": " %d %B %Y",
                "trunc_unit": TruncDay("event_date"),
            },
            "6_months": {
                "date_format": "%B %Y",
                "trunc_unit": TruncMonth("event_date"),
            },
            "1_year": {
                "date_format": "%Y",
                "trunc_unit": TruncYear("event_date"),
            },
        }

        # Apply the specified period (if provided)
        if period in period_settings:
            period_data = period_settings[period]
            date_format = period_data["date_format"]
            trunc_unit = period_data["trunc_unit"]
        else:
            # Handle invalid period option here (optional)
            return Response({"error": "Invalid period option."})

        # Populate the clicks data for the past 24 hours (1_day period)
        if period == "1_day":
            # Query the Analytics data for the specified products and date range
            start_date = end_date - timedelta(hours=24)
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

            # Initialize the clicks_by_product dictionary for all periods
            clicks_by_product = {}
            for item in product_clicks:
                product = item["product"]
                interval = item["interval"]
                clicks = item["clicks"]

                interval_str = interval.strftime(date_format)

                if product not in clicks_by_product:
                    clicks_by_product[product] = {}

                clicks_by_product[product][interval_str] = clicks
            current_date = end_date - timedelta(hours=24)
            while current_date <= end_date:
                interval_str = current_date.strftime(date_format)
                for product in product_names:
                    if product not in clicks_by_product:
                        clicks_by_product[product] = {}
                    if interval_str not in clicks_by_product[product]:
                        clicks_by_product[product][interval_str] = 0
                current_date += timedelta(hours=1)

            sorted_clicks_by_product = {}
            for product, interval_data in clicks_by_product.items():
                sorted_intervals = sorted(
                    (interval, clicks)
                    for interval, clicks in interval_data.items()
                    if interval.startswith(current_day_of_week)
                )
                sorted_intervals_dict = dict(sorted_intervals)
                sorted_clicks_by_product[product] = sorted_intervals_dict

            return Response(sorted_clicks_by_product)

            # Populate the clicks data for the past 7 days (7_days period)
        if period == "7_days":
            # Query the Analytics data for the specified products and date range
            start_date = end_date - timedelta(days=7)
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

            # Initialize the clicks_by_product dictionary for all periods
            clicks_by_product = {}
            for item in product_clicks:
                product = item["product"]
                interval = item["interval"]
                clicks = item["clicks"]

                interval_str = interval.strftime(date_format)

                if product not in clicks_by_product:
                    clicks_by_product[product] = {}

                clicks_by_product[product][interval_str] = clicks
            current_date = end_date - timedelta(days=6)
            while current_date <= end_date:
                interval_str = current_date.strftime(date_format)
                for product in product_names:
                    if product not in clicks_by_product:
                        clicks_by_product[product] = {}
                    if interval_str not in clicks_by_product[product]:
                        clicks_by_product[product][interval_str] = 0
                current_date += timedelta(days=1)

            # Sort the intervals and populate sorted_clicks_by_product
            sorted_clicks_by_product = {}
            for product, interval_data in clicks_by_product.items():
                sorted_intervals = sorted(
                    interval_data.items(),
                    key=lambda x: datetime.strptime(x[0], date_format),
                )
                sorted_intervals_dict = dict(sorted_intervals)
                sorted_clicks_by_product[product] = sorted_intervals_dict
            # only return seven days
            return Response(sorted_clicks_by_product)

        if period == "30_days":
            start_date = end_date - timedelta(days=30)
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

            # Initialize the clicks_by_product dictionary for all periods
            clicks_by_product = {}
            for item in product_clicks:
                product = item["product"]
                interval = item["interval"]
                clicks = item["clicks"]

                interval_str = interval.strftime(date_format)

                if product not in clicks_by_product:
                    clicks_by_product[product] = {}

                clicks_by_product[product][interval_str] = clicks
            current_date = end_date - timedelta(days=30)
            while current_date <= end_date:
                interval_str = current_date.strftime(date_format)
                for product in product_names:
                    if product not in clicks_by_product:
                        clicks_by_product[product] = {}
                    if interval_str not in clicks_by_product[product]:
                        clicks_by_product[product][interval_str] = 0
                current_date += timedelta(days=1)

            # Sort the intervals and populate sorted_clicks_by_product
            sorted_clicks_by_product = {}
            for product, interval_data in clicks_by_product.items():
                sorted_intervals = sorted(
                    interval_data.items(),
                    key=lambda x: datetime.strptime(x[0], date_format),
                )
                sorted_intervals_dict = dict(sorted_intervals)
                sorted_clicks_by_product[product] = sorted_intervals_dict
            return Response(sorted_clicks_by_product)

        if period == "6_months":
            start_date = end_date - timedelta(days=180)
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

            # Initialize the clicks_by_product dictionary for all periods
            clicks_by_product = {}
            for item in product_clicks:
                product = item["product"]
                interval = item["interval"]
                clicks = item["clicks"]

                interval_str = interval.strftime(date_format)

                if product not in clicks_by_product:
                    clicks_by_product[product] = {}

                clicks_by_product[product][interval_str] = clicks
            current_date = end_date - timedelta(days=180)
            while current_date <= end_date:
                interval_str = current_date.strftime(date_format)
                for product in product_names:
                    if product not in clicks_by_product:
                        clicks_by_product[product] = {}
                    if interval_str not in clicks_by_product[product]:
                        clicks_by_product[product][interval_str] = 0
                current_date += timedelta(days=1)

            # Sort the intervals and populate sorted_clicks_by_product
            sorted_clicks_by_product = {}
            for product, interval_data in clicks_by_product.items():
                sorted_intervals = sorted(
                    interval_data.items(),
                    key=lambda x: datetime.strptime(x[0], date_format),
                )
                sorted_intervals_dict = dict(sorted_intervals)
                sorted_clicks_by_product[product] = sorted_intervals_dict
            return Response(sorted_clicks_by_product)

        if period == "1_year":
            start_date = end_date - timedelta(days=365)
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

            # Initialize the clicks_by_product dictionary for all periods
            clicks_by_product = {}
            for item in product_clicks:
                product = item["product"]
                interval = item["interval"]
                clicks = item["clicks"]

                interval_str = interval.strftime(date_format)

                if product not in clicks_by_product:
                    clicks_by_product[product] = {}

                clicks_by_product[product][interval_str] = clicks
            current_date = end_date - timedelta(days=365)
            while current_date <= end_date:
                interval_str = current_date.strftime(date_format)
                for product in product_names:
                    if product not in clicks_by_product:
                        clicks_by_product[product] = {}
                    if interval_str not in clicks_by_product[product]:
                        clicks_by_product[product][interval_str] = 0
                current_date += timedelta(days=1)

            # Sort the intervals and populate sorted_clicks_by_product
            sorted_clicks_by_product = {}
            for product, interval_data in clicks_by_product.items():
                sorted_intervals = sorted(
                    interval_data.items(),
                    key=lambda x: datetime.strptime(x[0], date_format),
                )
                sorted_intervals_dict = dict(sorted_intervals)
                sorted_clicks_by_product[product] = sorted_intervals_dict
            return Response(sorted_clicks_by_product)

