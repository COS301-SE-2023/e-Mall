from rest_framework import serializers
from product.models import Product
from productseller.models import ProductSeller
from seller.models import Seller
from django.db.models import Subquery, OuterRef


class ProductSerializer(serializers.ModelSerializer):
    min_price_original_price = serializers.SerializerMethodField()
    min_price_discount = serializers.SerializerMethodField()
    min_price_discount_rate = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()
    min_price_seller_id = serializers.UUIDField()
    min_price_seller_product_url = serializers.SerializerMethodField()
    min_price_seller_business_name = serializers.SerializerMethodField()
    min_price_in_stock = serializers.SerializerMethodField()
    min_price_img_array = serializers.SerializerMethodField()

    def get_min_price(self, obj):
        min_price, _, _, _, _, _, _, _, _ = obj.get_minimum_price()
        return min_price

    def get_min_price_seller_id(self, obj):
        _, seller_id, _, _, _, _, _, _, _ = obj.get_minimum_price()
        return seller_id

    def get_min_price_seller_product_url(self, obj):
        _, _, seller_url, _, _, _, _, _, _ = obj.get_minimum_price()
        return seller_url

    def get_min_price_seller_business_name(self, obj):
        _, _, _, business_name, _, _, _, _, _ = obj.get_minimum_price()
        return business_name

    def get_min_price_in_stock(self, obj):
        _, _, _, _, in_stock, _, _, _, _ = obj.get_minimum_price()
        return in_stock

    def get_min_price_discount(self, obj):
        _, _, _, _, _, discount, _, _, _ = obj.get_minimum_price()
        return discount

    def get_min_price_discount_rate(self, obj):
        _, _, _, _, _, _, discount_rate, _, _ = obj.get_minimum_price()
        return discount_rate

    def get_min_price_original_price(self, obj):
        _, _, _, _, _, _, _, original_price, _ = obj.get_minimum_price()
        return original_price

    def get_min_price_img_array(self, obj):
        _, _, _, _, _, _, _, _,  img_array = obj.get_minimum_price()
        return img_array

    class Meta:
        model = Product
        fields = "__all__"
