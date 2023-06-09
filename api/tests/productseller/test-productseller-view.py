from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from seller.models import Seller
from productseller.models import ProductSeller
from product.models import Product


class ProductSellerFrontendAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create test data here
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

    def test_product_seller_frontend_api_view(self):
        response = self.client.get('/api/productseller/frontend/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['price'], '90.00')
        self.assertEqual(response.data[1]['price'], '180.00')


class ProductSellerBackendAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create test data here
        self.seller1 = Seller.objects.create(
            username='Test Seller 1', business_name='Test Seller 1', email='test1@example.com', reg_no='1234567891011', website='http://www.test1.com', feed_url='http://www.test1.com')

        self.seller2 = Seller.objects.create(
            username='Test Seller 2', business_name='Test Seller 2', email='test2@example.com', reg_no='1234567891012', website='http://www.test2.com', feed_url='http://www.test2.com')

        self.product1 = Product.objects.create(
            name='Test Product 1', brand='Test Brand 1', category='Test Category 1')

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
            product=self.product1,
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

    def test_get_specific_product(self):
        response = self.client.get(
            f'/api/productseller/backend/?prod_id={self.product1.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['price'], '90.00')
        self.assertEqual(response.data[1]['price'], '180.00')

    def test_filter_in_stock(self):
        response = self.client.get(
            f'/api/productseller/backend/?prod_id={self.product1.id}&filter_in_stock=True')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['price'], '90.00')

    def test_sort_products_price(self):
        response = self.client.get(
            f'/api/productseller/backend/?prod_id={self.product1.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['price'], '90.00')

    def test_sort_products_discount(self):
        response = self.client.get(
            f'/api/productseller/backend/?prod_id={self.product1.id}&sort=discount')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['discount_rate'], '0.10')
