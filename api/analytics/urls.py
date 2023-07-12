from django.urls import path
from .views import (
    ProductAnalyticsAPIView,
    AllProductAnalyticsAPIView,
    CreateProductAnalyticsAPIView,
)

urlpatterns = [
    path(
        "productanalytics/", ProductAnalyticsAPIView.as_view(), name="productanalytics"
    ),
    path(
        "allproductanalytics/",
        AllProductAnalyticsAPIView.as_view(),
        name="allproductanalytics",
    ),
    path(
        "createproductanalytics/",
        CreateProductAnalyticsAPIView.as_view(),
        name="createproductanalytics",
    ),
]
