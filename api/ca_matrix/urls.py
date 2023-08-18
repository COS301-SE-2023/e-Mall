from django.urls import path
from . import views

urlpatterns = [
    path('initdb/', views.CAMatrixView.as_view(), name='ca_matrix'),

]