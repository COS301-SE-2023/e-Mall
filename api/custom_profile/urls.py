from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.get, name='get_profile'),
    path('update/', views.update, name='update_profile'),
]
