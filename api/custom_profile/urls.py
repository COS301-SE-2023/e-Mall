from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.get_profile, name='get_profile'),
    # path('update/', views.register, name='seller_register'),
]
