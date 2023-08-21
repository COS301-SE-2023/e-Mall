from django.urls import path
from . import views

urlpatterns = [
    path("check_email/", views.check_email_exists, name="custom_auth_check_email"),
]
