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
            seller__business_name=seller_name, event_type="link_click"
        ).count()
        product_clicks = Analytics.objects.filter(
            seller__business_name=seller_name, event_type="product_click"
        ).count()
        response_data = {"product clicks": product_clicks, "link clicks": link_clicks}
        return Response(response_data)


class AllProductAnalyticsAPIView(APIView):
    def get(self, request):
        seller_name = request.GET.get("seller_name")

        product_clicks = (
            Analytics.objects.filter(
                seller__business_name=seller_name, event_type="product_click"
            )
            .values("product__name")
            .annotate(clicks=Count("id"))
            .order_by("product__name")
        )

        response_data = [
            {"product": item["product__name"], "clicks": item["clicks"]}
            for item in product_clicks
        ]

        return Response(response_data)


class CreateProductAnalyticsAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            analytics = Analytics(
                seller=request.data.get("seller_id"),
                product=request.data.get("product_id"),
                consumer=request.data.get("consumer_id"),
                event_type=request.data.get("event_type"),
                metadata=request.data.get("metadata"),
            )
            analytics.save()
            return Response(
                {"message": "Product Analytics created successfully"}, status=201
            )

        except Exception as e:
            return Response({"message": str(e)}, status=400)
