from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import AllowAny
from rest_framework import status
from .serializers import ConsumerProfileSerializer, SellerProfileSerializer
from consumer.models import Consumer
from seller.models import Seller


@api_view(['POST'])
def get_profile(request):
    try:
        user = request.user
        serializer = None
        if user is None:
            raise Exception('User not found')
        if (user.type == 'consumer'):
            serializer = ConsumerProfileSerializer(user)
        elif (user.type == 'seller'):
            serializer = SellerProfileSerializer(user)
        if (serializer is None):
            raise Exception('Serializer not found')
        return Response(serializer.data)
    except Exception as e:
        # handle other exceptions here
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
