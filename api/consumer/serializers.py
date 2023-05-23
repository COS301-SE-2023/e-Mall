from rest_framework import serializers

from user.serializers import UserSerializer

from .models import Consumer


class ConsumerSerializer(UserSerializer):
    # additional_field = serializers.SerializerMethodField()

    # def get_additional_field(self, obj):
    #     return (object.wishlist)

    class Meta:

        model = Consumer
        # fields = ('id', 'username', 'email', 'type', 'reg_no', 'business_name',
        #           'business_type', 'busines_category', 'catalogue_size', 'status', 'is_verified', 'website', 'feed_url', 'created_at', 'modified_at', 'last_login')
        fields = UserSerializer.Meta.fields + ('wishlist',)
