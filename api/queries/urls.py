from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create, name="create"),
    path("get/", views.getQueries, name="getQueries"),
    path("update/", views.UpdateQuery, name="deleteQuery"),
]
