from django.urls import path
from .views import ProductSellerFrontendAPIView, ProductSellerBackendAPIView, ProductSellerProdUpdateAPIView

urlpatterns = [
    path("frontend/", ProductSellerFrontendAPIView.as_view()),
    path("backend/", ProductSellerBackendAPIView.as_view()),
    path("produpdate/", ProductSellerProdUpdateAPIView.as_view())
]
