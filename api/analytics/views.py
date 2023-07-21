from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Analytics
from django.http import JsonResponse

from django.db.models import Q
from django.db.models import Count
from rest_framework.permissions import AllowAny

# Create your views here.


class ProductAnalyticsAPIView(APIView):
    def get(self, request):
        seller_name = request.GET.get("seller_name")
        link_clicks = Analytics.objects.filter(
            seller=seller_name, event_type="link_click"
        ).count()
        product_clicks = Analytics.objects.filter(
            seller=seller_name, event_type="product_click"
        ).count()
        fav_clicks = Analytics.objects.filter(
            seller=seller_name, event_type="favourited_product"
        ).count()
        response_data = {
            "product_clicks": product_clicks,
            "link_clicks": link_clicks,
            "fav_clicks": fav_clicks,
        }
        return Response(response_data)


class AllProductAnalyticsAPIView(APIView):
    def get(self, request):
        seller_name = request.GET.get("seller_name")

        product_clicks = (
            Analytics.objects.filter(seller=seller_name, event_type="product_click")
            .values("product")
            .annotate(clicks=Count("id"))
            .order_by("product")
        )

        response_data = [
            {"product_name": item["product"], "clicks": item["clicks"]}
            for item in product_clicks
        ]

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
                seller=seller_name,
                event_type="product_click",
                product=product["product"],
            ).count()
            link_clicks = Analytics.objects.filter(
                seller=seller_name, event_type="link_click", product=product["product"]
            ).count()
            conversion_rate = 0
            if link_clicks > 0:
                conversion_rate = (product_clicks / link_clicks) * 100
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
        )

        # Calculate the percentage for each category
        response_data = []
        for category in category_clicks:
            percentage = (category["count"] / total_product_clicks) * 100
            response_data.append(
                {"category": category["product_category"], "percentage": percentage}
            )

        return Response(response_data)
