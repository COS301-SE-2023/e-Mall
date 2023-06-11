from django.urls import path
from .views import ProductSellerFrontendAPIView, ProductSellerBackendAPIView

urlpatterns = [
    path("productseller/frontend", ProductSellerFrontendAPIView.as_view()),
    path("productseller/backend", ProductSellerBackendAPIView.as_view()),
]
