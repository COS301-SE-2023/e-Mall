from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APITestCase
from product.models import Product
from productseller.models import ProductSeller
from seller.models import Seller
from product.serializers import ProductSerializer


class ProductSerializerTestCase(APITestCase):
    def setUp(self):
        self.seller = Seller.objects.create(business_name='Test Seller')
        self.product = Product.objects.create(name='Test Product')
        self.product_seller = ProductSeller.objects.create(
            product=self.product,
            seller=self.seller,
            original_price=100,
            price=90,
            discount=10,
            discount_rate=0.1,
            in_stock=True,
            product_url='https://example.com/product',
            img_array=['https://example.com/image1.jpg',
                       'https://example.com/image2.jpg']
        )

    def test_product_serializer(self):
        serializer = ProductSerializer(instance=self.product)
        data = serializer.data
        self.assertAlmostEqual(
            Decimal(data['min_price']), Decimal('90'), places=2)
        self.assertEqual(data['min_price_seller_id'], str(self.seller.id))
        self.assertEqual(data['min_price_seller_product_url'],
                         'https://example.com/product')
        self.assertEqual(data['min_price_seller_business_name'], 'Test Seller')
        self.assertEqual(data['min_price_in_stock'], True)
        self.assertEqual(data['min_price_discount'], 10)
        self.assertEqual(
            Decimal(data['min_price_discount_rate']), Decimal('0.1'))
        self.assertEqual(data['min_price_original_price'], 100)
        self.assertEqual(data['min_price_img_array'], [
                         'https://example.com/image1.jpg', 'https://example.com/image2.jpg'])
