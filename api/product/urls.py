from django.urls import path
from .views import ProductFrontendAPIView, ProductBackendAPIView, ProductTestAPIView, GetPopularProductsAPIView, CreateAPIView, GetTrendingProductsAPIView
urlpatterns = [
    path("frontend/", ProductFrontendAPIView.as_view()),
    path("backend/", ProductBackendAPIView.as_view()),
    path("test/", ProductTestAPIView.as_view()),
    path("popularproducts/", GetPopularProductsAPIView.as_view(), name="popularproducts"),
    path("create/", CreateAPIView.as_view(), name="create"),
    path("trendingproducts/", GetTrendingProductsAPIView.as_view(), name="trendingproducts"),
]
