from django.urls import path
from .views import ProductFrontendAPIView, ProductBackendAPIView, ProductTestAPIView, GetPopularProductsAPIView, CreateAPIView
urlpatterns = [
    path("frontend/", ProductFrontendAPIView.as_view()),
    path("backend/", ProductBackendAPIView.as_view()),
    path("test/", ProductTestAPIView.as_view()),
    path("popularproducts/", GetPopularProductsAPIView.as_view(), name="popularproducts"),
    path("create/", CreateAPIView.as_view(), name="create"),
]
