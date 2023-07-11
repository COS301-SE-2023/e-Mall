from django.urls import path
from .views import ProductAnalyticsAPIView, AllProductAnalyticsAPIView, CreateProductAnalyticsAPIView

urlpatterns = [
    path("productanalytics/", ProductAnalyticsAPIView.as_view()),
    path("allproductanalytics/", AllProductAnalyticsAPIView.as_view()),
    path("createproductanalytics/", CreateProductAnalyticsAPIView.as_view()),

]

