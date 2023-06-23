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


class ProductFilterSerializer(serializers.ModelSerializer):
    # min_price = serializers.IntegerField()

    # seller_name = serializers.CharField(
    #     source='productseller.seller.business_name')
    category = serializers.CharField()
    # brand = serializers.CharField()
    # min_price = serializers.SerializerMethodField()
    # max_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_min_price(self, obj):
        return obj.productseller_set.order_by('price').first().price

    def get_max_price(self, obj):
        return obj.productseller_set.order_by('-price').first().price

    def __init__(self, *args, **kwargs):

        # search = kwargs.pop('search', '')
        # sort = kwargs.pop('sort', '')
        products = products
        filter_brand = kwargs.pop('filter_brand', [])
        filter_price_min = kwargs.pop('filter_price_min', None)
        filter_price_max = kwargs.pop('filter_price_max', None)
        filter_category = kwargs.pop('filter_category', [])
        filter_date_min = kwargs.pop('filter_date_min', None)
        filter_date_max = kwargs.pop('filter_date_max', None)
        filter_seller = kwargs.pop('filter_seller', [])

        if filter_brand:
            products = products.filter(brand__in=filter_brand)

        if filter_category:
            products = products.filter(category__in=filter_category)

        if filter_date_min:
            products = products.filter(updated_at__gte=filter_date_min)

        if filter_date_max:
            products = products.filter(updated_at__lte=filter_date_max)

        if filter_seller:
            products = products.filter(
                productseller__seller__business_name__in=filter_seller)

        if filter_price_min or filter_price_max:
            product_sellers = ProductSeller.objects.filter(
                product=OuterRef('pk'))

            if filter_price_min:
                product_sellers = product_sellers.filter(
                    price__gte=filter_price_min)

            if filter_price_max:
                product_sellers = product_sellers.filter(
                    price__lte=filter_price_max)

            products = products.annotate(
                min_filtered_price_product_seller_id=Subquery(
                    product_sellers.order_by('price').values('id')[:1])
            ).exclude(min_filtered_price_product_seller_id=None)
        print(products.values())
        super().__init__(products, *args, **kwargs)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        print(data)
        return data
