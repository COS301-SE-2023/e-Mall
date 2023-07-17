from seller.serializers import SellerSerializer
from consumer.serializers import ConsumerSerializer
from seller.models import Seller
from consumer.models import Consumer
from rest_framework import serializers


class ConsumerProfileSerializer(ConsumerSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {
            'id': data.get('id'),
            'username': data.get('username'),
            'email': data.get('email'),
            'type': data.get('type'),
            'details': {
                'wishlist': data.get('wishlist'),
                'created_at': data.get('created_at'),
                'modified_at': data.get('modified_at'),
            }
        }


class SellerProfileSerializer(SellerSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {
            'id': data.get('id'),
            'username': data.get('username'),
            'email': data.get('email'),
            'type': data.get('type'),
            'details': {
                'reg_no': data.get('reg_no'),
                'business_name': data.get('business_name'),
                'business_type': data.get('business_type'),
                'business_category': data.get('business_category'),
                'catalogue_size': data.get('catalogue_size'),
                'status': data.get('status'),
                'is_verified': data.get('is_verified'),
                'website': data.get('website'),
                'feed_url': data.get('feed_url'),
                'no_employees': data.get('no_employees')
            }
        }
