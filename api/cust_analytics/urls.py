from django.urls import path
from .views import PredictCustAnalyticsView

urlpatterns = [
    path('predicted_matrix/', PredictCustAnalyticsView.as_view(), name='predicted_matrix'),
]