from rest_framework import serializers
from .models import ProductSeller


class ProductSellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSeller
        fields = "__all__"
