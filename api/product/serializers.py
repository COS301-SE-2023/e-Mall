from rest_framework import serializers
from product.models import Product
from seller.models import Seller


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ["id", "name", "email"]


class ProductSerializer(serializers.ModelSerializer):
    sellers = SellerSerializer(many=True)

    class Meta:
        model = Product
        fields = ["id", "name", "description", "image", "sellers"]

    def create(self, validated_data):
        sellers_data = validated_data.pop("sellers")
        product = Product.objects.create(**validated_data)
        for seller_data in sellers_data:
            Seller.objects.create(product=product, **seller_data)
        return product

    def validate(self, attrs):
        sellers_data = attrs.get("sellers")
        if not sellers_data:
            raise serializers.ValidationError("At least one seller must be provided.")
        return attrs
