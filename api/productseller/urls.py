from django.urls import path
from .views import ProductSellerFrontendAPIView, ProductSellerBackendAPIView, ProductSellerDashboardAPIView

urlpatterns = [
    path("frontend/", ProductSellerFrontendAPIView.as_view()),
    path("backend/", ProductSellerBackendAPIView.as_view()),
    path("sellerdashboard/", ProductSellerDashboardAPIView.as_view(), name="sellerdashboard"),
]
