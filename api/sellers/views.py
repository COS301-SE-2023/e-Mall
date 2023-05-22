# from django.shortcuts import render
from rest_framework import viewsets
from .serializers import SellersSerializer
from .models import Sellers
# Create your views here.


class SellersViewSet(viewsets.ModelViewSet):
    queryset = Sellers.objects.all()
    serializer_class = SellersSerializer
