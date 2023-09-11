from django.urls import path
from .views import post

urlpatterns = [
    path("predicted_matrix/", post, name="predicted_matrix"),
]
