from django.urls import path
from .views import ProductSellerFrontendAPIView, ProductSellerBackendAPIView, ProductSellerProdUpdateAPIView,ProductSellerProdDeleteAPIView,ProductSellerDashboardAPIView
urlpatterns = [
    path("frontend/", ProductSellerFrontendAPIView.as_view()),
    path("backend/", ProductSellerBackendAPIView.as_view()),
    path("produpdate/", ProductSellerProdUpdateAPIView.as_view(),name="produpdate"),
    path("proddelete/", ProductSellerProdDeleteAPIView.as_view(),name="proddelete"),
    path("sellerdashboard/", ProductSellerDashboardAPIView.as_view(), name="sellerdashboard"),
]
