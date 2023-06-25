from rest_framework import serializers
from .models import ProductSeller


class ProductSellerSerializer(serializers.ModelSerializer):
    business_name = serializers.SerializerMethodField()
    def get_business_name(self, obj):
        business_name = obj.get_names()
        return business_name

    class Meta:
        model = ProductSeller
        fields = "__all__"
