from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create, name="create"),
    path("delete/", views.delete, name="delete"),
    path("read/", views.read, name="read"),
    path("get/", views.get, name="get"),
    path("device/", views.update_device_token, name="device"),
]
