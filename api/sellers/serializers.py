from rest_framework import serializers

from .models import Sellers


class SellersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sellers
        fields = ('reg_no', 'business_name',
                  'busines_category', 'status', 'is_verified', 'website', 'user_id')
