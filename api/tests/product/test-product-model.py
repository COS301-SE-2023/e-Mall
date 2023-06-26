from django.test import TestCase
from product.models import Product


class ProductTestCase(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            brand='Test Brand',
            category='electronics'
        )

    def test_get_minimum_price_no_sellers(self):
        min_price, seller_id, seller_url, business_name, in_stock, discount, discount_rate, original_price, img_array = self.product.get_minimum_price()
        self.assertIsNone(min_price)
        self.assertIsNone(seller_id)
        self.assertIsNone(seller_url)
        self.assertIsNone(business_name)
        self.assertIsNone(in_stock)
        self.assertIsNone(discount)
        self.assertIsNone(discount_rate)
        self.assertIsNone(original_price)
        self.assertIsNone(img_array)

    def test_min_price_no_sellers(self):
        min_price = self.product.min_price()
        self.assertIsNone(min_price)

    def test_min_price_seller_id_no_sellers(self):
        seller_id = self.product.min_price_seller_id()
        self.assertIsNone(seller_id)

    def test_min_price_seller_product_url_no_sellers(self):
        seller_url = self.product.min_price_seller_product_url()
        self.assertIsNone(seller_url)

    def test_min_price_seller_business_name_no_sellers(self):
        business_name = self.product.min_price_seller_business_name()
        self.assertIsNone(business_name)

    def test_min_price_in_stock_no_sellers(self):
        in_stock = self.product.min_price_in_stock()
        self.assertIsNone(in_stock)

    def test_min_price_discount_no_sellers(self):
        discount = self.product.min_price_discount()
        self.assertIsNone(discount)

    def test_min_price_discount_rate_no_sellers(self):
        discount_rate = self.product.min_price_discount_rate()
        self.assertIsNone(discount_rate)

    def test_min_price_original_price_no_sellers(self):
        original_price = self.product.min_price_original_price()
        self.assertIsNone(original_price)

    def test_min_price_img_array_no_sellers(self):
        img_array = self.product.min_price_img_array()
        self.assertIsNone(img_array)

    def test_str_method(self):
        product_str = str(self.product)
        expected_str = 'Test Product'
        self.assertEqual(product_str, expected_str)
