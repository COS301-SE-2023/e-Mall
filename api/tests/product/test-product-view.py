from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APITestCase, APIRequestFactory
from product.models import Product
from productseller.models import ProductSeller
from seller.models import Seller
from product.views import ProductBackendAPIView, ProductTestAPIView
from rest_framework.test import APIClient


class ProductBackendAPIViewTestCase(APITestCase):
    # following tests and productbackned should be fixed. api giving wrong result
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.seller1 = Seller.objects.create(
            username='Test Seller 1', business_name='Test Seller 1', email='test1@example.com', reg_no='1234567891011', website='http://www.test1.com', feed_url='http://www.test1.com')

        self.seller2 = Seller.objects.create(
            username='Test Seller 2', business_name='Test Seller 2', email='test2@example.com', reg_no='1234567891012', website='http://www.test2.com', feed_url='http://www.test2.com')

        self.product1 = Product.objects.create(
            name='Test Product 1', brand='Test Brand 1', category='Test Category 1')
        self.product2 = Product.objects.create(
            name='Test Product 2', brand='Test Brand 2', category='Test Category 2')
        self.product_seller1 = ProductSeller.objects.create(
            product=self.product1,
            seller=self.seller1,
            original_price=100,
            price=90,
            discount=10,
            discount_rate=0.1,
            in_stock=True,
            product_url='https://example.com/product1',
            img_array=['https://example.com/image1.jpg',
                       'https://example.com/image2.jpg']
        )
        self.product_seller2 = ProductSeller.objects.create(
            product=self.product2,
            seller=self.seller2,
            original_price=200,
            price=180,
            discount=20,
            discount_rate=0.1,
            in_stock=False,
            product_url='https://example.com/product2',
            img_array=['https://example.com/image3.jpg',
                       'https://example.com/image4.jpg']
        )

    def test_product_backend_api_view(self):
        view = ProductBackendAPIView.as_view()
        request = self.factory.get('/api/product/backend/')
        response = view(request)
        self.assertEqual(response.status_code, 200)
        data = response.data['data']
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['name'], 'Test Product 1')

    def test_get_all_products(self):
        response = self.client.get('/api/products/backend/')
        self.assertEqual(response.status_code, 200)
        data = response.data['data']
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['name'], 'Test Product 1')
        self.assertEqual(data[1]['name'], 'Test Product 2')

    def test_get_specific_product(self):
        response = self.client.get(
            f'/api/products/backend/?prod_id={self.product1.id}')
        data = response.data['data']
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data[0]['name'], 'Test Product 1')

    def test_search_products(self):
        response = self.client.get('/api/products/backend/?search=Product%201')
        self.assertEqual(response.status_code, 200)
        data = response.data['data']
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'Test Product 1')

    def test_sort_products(self):
        response = self.client.get('/api/products/backend/?sort=-price')
        self.assertEqual(response.status_code, 200)
        data = response.data['data']
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['name'], 'Test Product 2')
        self.assertEqual(data[1]['name'], 'Test Product 1')

    def test_filter_products(self):
        response = self.client.get(
            '/api/products/backend/?filter_brand=Brand%201&filter_price_min=80&filter_price_max=100&filter_category=Category%201&filter_in_stock=True')
        self.assertEqual(response.status_code, 200)
        data = response.data['data']
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'Test Product 1')

    def test_pagination(self):
        response = self.client.get('/api/products/backend/?page=1&per_page=1')
        self.assertEqual(response.status_code, 200)
        data = response.data['data']
        self.assertEqual(len(data), 1)


class ProductTestAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.seller1 = Seller.objects.create(
            username='Test Seller 1', business_name='Test Seller 1', email='test1@example.com', reg_no='1234567891011', website='http://www.test1.com', feed_url='http://www.test1.com')

        self.seller2 = Seller.objects.create(
            username='Test Seller 2', business_name='Test Seller 2', email='test2@example.com', reg_no='1234567891012', website='http://www.test2.com', feed_url='http://www.test2.com')

        self.product1 = Product.objects.create(
            name='Test Product 1', brand='Test Brand 1', category='Test Category 1')
        self.product2 = Product.objects.create(
            name='Test Product 2', brand='Test Brand 2', category='Test Category 2')
        self.product_seller1 = ProductSeller.objects.create(
            product=self.product1,
            seller=self.seller1,
            original_price=100,
            price=90,
            discount=10,
            discount_rate=0.1,
            in_stock=True,
            product_url='https://example.com/product1',
            img_array=['https://example.com/image1.jpg',
                       'https://example.com/image2.jpg']
        )
        self.product_seller2 = ProductSeller.objects.create(
            product=self.product2,
            seller=self.seller2,
            original_price=200,
            price=180,
            discount=20,
            discount_rate=0.1,
            in_stock=False,
            product_url='https://example.com/product2',
            img_array=['https://example.com/image3.jpg',
                       'https://example.com/image4.jpg']
        )

    def test_product_test_api_view(self):
        view = ProductTestAPIView.as_view()
        request = self.factory.get('/product/test/', {'search': 'Test'})
        response = view(request)
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data['data']), 2)
        self.assertEqual(data['data'][0]['name'], 'Test Product 1')

    def test_search_products(self):
        response = self.client.get('/api/products/test/?search=Product%201')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['name'], 'Test Product 1')

    def test_sort_products(self):
        response = self.client.get(
            '/api/products/test/?search=product&sort=-price')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['data']), 2)
        self.assertEqual(response.data['data'][0]['name'], 'Test Product 2')
        self.assertEqual(response.data['data'][1]['name'], 'Test Product 1')

    def test_filter_products(self):
        response = self.client.get(
            '/api/products/test/?search=p&filter_brand=Brand%201&filter_price_min=80&filter_price_max=100&filter_category=Category%201&filter_in_stock=True')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['name'], 'Test Product 1')

    def test_pagination(self):
        response = self.client.get(
            '/api/products/test/?search=Product%201&page=0&per_page=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['data']), 1)

    def test_min_price(self):
        response = self.client.get('/api/products/test/')
        for product in response.data['data']:
            min_price = product['min_price']
            min_price_original_price = product['min_price_original_price']
            min_price_discount_rate = product['min_price_discount_rate']
            expected_min_price = min_price_original_price * \
                (1 - min_price_discount_rate)
            self.assertAlmostEqual(
                Decimal(min_price), expected_min_price, places=2)


class ProductFrontendAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.product1 = Product.objects.create(name='Test Product 1')
        self.product2 = Product.objects.create(name='Test Product 2')

    def test_get_all_products(self):
        response = self.client.get('/api/products/frontend/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], 'Test Product 1')
        self.assertEqual(response.data[1]['name'], 'Test Product 2')

    def test_get_specific_product(self):
        response = self.client.get(
            f'/api/products/frontend/?prod_id={self.product1.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Test Product 1')
