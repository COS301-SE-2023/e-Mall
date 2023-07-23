from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='consumer_register'),
    path('update/', views.update, name='consumer_update'),
    path('get_consumer_info/', views.get_consumer_info, name='get_consumer_info'),
]
