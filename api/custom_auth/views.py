from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from seller.models import Seller
from consumer.models import Consumer
from rest_framework import status


@api_view(["POST"])
@permission_classes([AllowAny])
def check_email_exists(request):
    email = request.data.get("email")
    if email:
        user_exists = Seller.objects.filter(email=email).exists()
        if not user_exists:
            user_exists = Consumer.objects.filter(email=email).exists()
        if user_exists:
            return Response(True, status=status.HTTP_200_OK)
    return Response(
        False,
        status=status.HTTP_200_OK,
    )
