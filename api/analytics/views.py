from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Analytics
from .serializers import AnalyticsSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny

from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
# Create your views here.

class ProductAnalyticsAPIView(APIView):
    def get(self, request):
        seller = request.GET.get("seller")
        filters = Q(productseller__seller_name=seller)
        analytics = Analytics.objects.filter(filters)
        analytics = analytics.order_by("-event_date")
        serializer = AnalyticsSerializer(analytics, many=True)
        return Response(serializer.data)