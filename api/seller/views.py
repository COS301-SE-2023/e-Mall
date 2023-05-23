# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets
from .serializers import SellerSerializer
from .models import Seller
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
# Create your views here.


class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer

    def update_is_verified(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_verified = request.data.get('is_verified')
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def is_verified(self, request, *args, **kwargs):
        instance = self.get_object()
        return Response({'is_verified': instance.is_verified})
