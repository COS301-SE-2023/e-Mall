# from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ConsumerSerializer
from .models import Consumer
# Create your views here.


class ConsumerViewSet(viewsets.ModelViewSet):
    queryset = Consumer.objects.all()
    serializer_class = ConsumerSerializer
