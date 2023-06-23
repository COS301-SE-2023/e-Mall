from django.urls import path
from .views import ProductFrontendAPIView, ProductBackendAPIView, ProductTestAPIView

urlpatterns = [
    path("frontend/", ProductFrontendAPIView.as_view()),
    path("backend/", ProductBackendAPIView.as_view()),
    path("test/", ProductTestAPIView.as_view())
]
