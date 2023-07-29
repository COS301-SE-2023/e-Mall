from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import AllowAny
from rest_framework import status
from .serializers import ConsumerProfileSerializer, SellerProfileSerializer
from consumer.models import Consumer
from seller.models import Seller


@api_view(["POST"])
def get(request):
    try:
        user = request.user
        serializer = None
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            serializer = ConsumerProfileSerializer(user)
        elif user.type == "seller":
            serializer = SellerProfileSerializer(user)
        if serializer is None:
            raise Exception("Serializer not found")
        return Response(serializer.data)
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def update(request):
    try:
        user = request.user
        serializer = None
        if user is None:
            raise Exception("User not found")
        data = request.data.copy()
        details_data = data.pop("details", {})
        data.update(details_data)
        if user.type == "consumer":
            serializer = ConsumerProfileSerializer(user, data=data, partial=True)

        elif user.type == "seller":
            serializer = SellerProfileSerializer(user, data=data, partial=True)
        if serializer is None:
            raise Exception("Serializer not found")
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def updateWishlist(request):
    try:
        user = request.user
        product_id = request.data.get("prod_id")
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            consumer = Consumer.objects.get(email=user.email)
            if product_id in consumer.wishlist:
                consumer.wishlist.remove(product_id)
            else:
                consumer.wishlist.append(product_id)
            consumer.save()
            return Response({"success": True})
        else:
            raise Exception("Seller cannot have wishlist")
    except Exception as e:
        print(e)
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def updateFollowedSellers(request):
    try:
        user = request.user
        seller_name = request.data.get("seller_name")
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            consumer = Consumer.objects.get(email=user.email)
            if seller_name in consumer.followed_sellers:
                consumer.followed_sellers.remove(seller_name)
            else:
                consumer.followed_sellers.append(seller_name)
            consumer.save()
            return Response({"success": True})
        else:
            raise Exception("Seller cannot follow sellers")
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
