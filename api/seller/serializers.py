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
            'no_employees'
        )

    # def to_representation(self, instance):
    #     print('passing to_representation')
    #     data = super().to_representation(instance)
    #     print(data)
    #     print(data['no_employees'])
    #     if data['no_employees'] <= 10:
    #         data['business_category'] = 'MICRO'
    #     elif data['no_employees'] <= 50:
    #         data['business_category'] = 'SMALL'
    #     elif data['no_employees'] <= 250:
    #         data['business_category'] = 'MEDIUM'
    #     else:
    #         data['business_category'] = 'UNFIT'
    #     return data
