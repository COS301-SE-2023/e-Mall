from user.serializers import UserSerializer
from .models import Seller
from product.serializers import ProductSerializer


class SellerSerializer(UserSerializer):
    # products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Seller
        fields = UserSerializer.Meta.fields + (
            "reg_no",
            "business_name",
            "business_type",
            "business_category",
            "catalogue_size",
            "status",
            "is_verified",
            "website",
            "feed_url",
            "no_employees",
            "support_email",
            "landline_number",
            "address",
            "city",
            "postal_code",
            "logo",
            "instagram_link",
            "facebook_link",
            "twitter_link",
        )
