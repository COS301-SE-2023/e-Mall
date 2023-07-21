from rest_framework import serializers
from user.serializers import UserSerializer
from .models import Consumer



class ConsumerSerializer(UserSerializer):
    class Meta:

        model = Consumer
        fields = UserSerializer.Meta.fields + ('wishlist','followed_sellers')
