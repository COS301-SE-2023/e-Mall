from django.urls import path
from . import views

urlpatterns = [
    path("getProd/", views.getProd, name="get_inventory"),
    path("update/", views.update, name="update_inventory"),
    path("delete/", views.delete, name="delete_inventory"),
]
