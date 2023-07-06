from rest_framework import serializers
from .models import ProductSeller


class ProductSellerSerializer(serializers.ModelSerializer):
    business_name = serializers.ReadOnlyField()
    product_category = serializers.ReadOnlyField()

    class Meta:
        model = ProductSeller
        fields = "__all__"
