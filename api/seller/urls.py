from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='seller_register'),
    path('auth_test/', views.auth_test, name='auth_test')
]
