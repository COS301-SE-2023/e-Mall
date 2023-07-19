from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="seller_register"),
    path("auth_test/", views.auth_test, name="auth_test"),
    path("seller_info/", views.get_seller_info, name="seller_info"),
    path("update_info/", views.update_seller_info, name="update_info"),
]
