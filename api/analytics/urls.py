from django.urls import path
from .views import (
    ProductAnalyticsAPIView,
    AllProductAnalyticsAPIView,
    CreateProductAnalyticsAPIView,
    ConversionRateAPIView,
    CategoryPercentageAPIView,
    SelectedProductsAPIView,
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
    path(
        "conversionrate/",
        ConversionRateAPIView.as_view(),
        name="conversionrate",
    ),
    path(
        "categorypercentage/",
        CategoryPercentageAPIView.as_view(),
        name="categorypercentage",
    ),
    path(
        "selectedproducts/", SelectedProductsAPIView.as_view(), name="selectedproducts"
    ),
]
