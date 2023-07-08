from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='consumer_register'),
]
