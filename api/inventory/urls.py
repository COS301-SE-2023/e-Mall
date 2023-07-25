from django.urls import path
from . import views

urlpatterns = [
    path("get/", views.get, name="get_inventory"),
    path("update/", views.update, name="update_inventory"),
    path("delete/", views.delete, name="delete_inventory"),
]
