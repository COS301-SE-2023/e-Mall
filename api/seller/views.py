# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets
from .serializers import SellerSerializer
from .models import Seller
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.shortcuts import get_object_or_404
# Create your views here.
from rest_framework import status


class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    http_method_names = ['get', 'post']

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = self.permission_classes
        return [permission() for permission in permission_classes]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    # def update_is_verified(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     instance.is_verified = request.data.get('is_verified')
    #     instance.save()
    #     serializer = self.get_serializer(instance)
    #     return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def is_verified(self, request, *args, **kwargs):
        instance = self.get_object()
        return Response({'is_verified': instance.is_verified})

    # def retrieve(self, request, pk=None):
    #     if '@' in pk:
    #         queryset = self.get_queryset().filter(email=pk)
    #         seller = queryset.first()
    #         if seller is not None:
    #             serializer = self.get_serializer(seller)
    #             return Response(serializer.data)
    #         else:
    #             return Response({'detail': 'Seller not found.'}, status=status.HTTP_404_NOT_FOUND)
    #     else:
    #         return super().retrieve(request, pk)
