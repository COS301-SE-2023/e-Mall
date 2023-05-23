from user.serializers import UserSerializer
from .models import Seller


class SellerSerializer(UserSerializer):
    class Meta:

        model = Seller
        fields = UserSerializer.Meta.fields + ('reg_no', 'business_name', 'business_type',
                                               'business_category', 'catalogue_size', 'status', 'is_verified', 'website', 'feed_url',)
