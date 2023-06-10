from django.urls import path
from .views import ProductFrontendAPIView, ProductBackendAPIView

urlpatterns = [
    path("products/frontend", ProductFrontendAPIView.as_view()),
    path("products/backend", ProductBackendAPIView.as_view()),
]
