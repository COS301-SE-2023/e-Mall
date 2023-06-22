from django.urls import path
from .views import ProductSellerFrontendAPIView, ProductSellerBackendAPIView

urlpatterns = [
    path("frontend/", ProductSellerFrontendAPIView.as_view()),
    path("backend/", ProductSellerBackendAPIView.as_view()),
]
