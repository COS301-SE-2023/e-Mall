from django.test import TestCase
from rest_framework.test import APITestCase, APIRequestFactory
from product.models import Product
from productseller.models import ProductSeller
from seller.models import Seller
from product.views import ProductBackendAPIView, ProductTestAPIView


class ProductBackendAPIViewTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
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

    def test_product_backend_api_view(self):
        view = ProductBackendAPIView.as_view()
        request = self.factory.get('/product/backend/')
        response = view(request)
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data['data']), 1)
        self.assertEqual(data['data'][0]['name'], 'Test Product')


class ProductTestAPIViewTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
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

    def test_product_test_api_view(self):
        view = ProductTestAPIView.as_view()
        request = self.factory.get('/product/test/', {'search': 'Test'})
        response = view(request)
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data['data']), 1)
        self.assertEqual(data['data'][0]['name'], 'Test Product')
