"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin

# from seller.views import SellerViewSet
# from staff.views import StaffViewSet


from rest_framework import routers
from django.urls import path, include

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.views.static import serve
from .settings import STATIC_ROOT
from django.urls import re_path
from django.views.generic.base import RedirectView

schema_view = get_schema_view(
    openapi.Info(
        title="E-mall API",
        default_version="v1",
        description="API for E-mall. For POST request, it must have token in request header",
        contact=openapi.Contact(email="syntaxsharks@google.com"),
        git="https://github.com/COS301-SE-2023/e-Mall",
        license=openapi.License(name="Your API License/"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# for api page
router = routers.DefaultRouter()
# router.register(r'staff', StaffViewSet)
# router.register(r'seller', SellerViewSet)
# router.register(r"consumer", ConsumerViewSet)

urlpatterns = [
    path("", RedirectView.as_view(url="/api")),
    path("admin/", admin.site.urls),
    path("api/seller/", include("seller.urls")),
    path("accounts/", include("rest_framework.urls")),
    # path("api-auth/", include("rest_framework.urls")),  # django auth
    path("api/auth/", include("custom_auth.urls")),  # custom auth
    path("api/products/", include("product.urls")),
    path("api/seller/", include("seller.urls")),
    path("api/consumer/", include("consumer.urls")),
    path("api/productseller/", include("productseller.urls")),
    path("api/analytics/", include("analytics.urls")),
    path("api/profile/", include("custom_profile.urls")),
    path("api/inventory/", include("inventory.urls")),
    path("api/camatrix/", include("ca_matrix.urls")),
    path("api/custanalytics/", include("cust_analytics.urls")),
    path("api/notification/", include("notification.urls")),
    path(
        "api/",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc-ui",
    ),
    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": STATIC_ROOT}),
]
