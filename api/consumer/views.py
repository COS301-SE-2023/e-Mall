# from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ConsumerSerializer
from .models import Consumer
from rest_framework import permissions

# Create your views here.


class ConsumerViewSet(viewsets.ModelViewSet):
    queryset = Consumer.objects.all()
    serializer_class = ConsumerSerializer
    http_method_names = ['get', 'post']

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = self.permission_classes
        return [permission() for permission in permission_classes]
