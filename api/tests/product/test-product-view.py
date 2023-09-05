from datetime import datetime, timedelta
from decimal import Decimal
from django.test import TestCase
from requests import patch
from rest_framework.test import APITestCase, APIRequestFactory
from user.models import User
from product.models import Product
from productseller.models import ProductSeller
from seller.models import Seller
from product.views import ProductBackendAPIView, ProductTestAPIView
from rest_framework.test import APIClient
from django.utils import timezone
from rest_framework import status


class ProductBackendAPIViewTestCase(APITestCase):
    # following tests and productbackned should be fixed. api giving wrong result
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.seller1 = Seller.objects.create(
            username="Test Seller 1",
            business_name="Test Seller 1",
            email="test1@example.com",
            reg_no="1234567891011",
            website="http://www.test1.com",
            feed_url="http://www.test1.com",
            no_employees=10,
            support_email="example@gmail.com",
            landline_number="1234567890",
            address="123 Main Street",
            city="Example City",
            postal_code="1234",
            logo="http://www.example.com/logo",
            instagram_link="http://www.instagram.com/example",
            facebook_link="http://www.facebook.com/example",
            twitter_link="http://www.twitter.com/example",
        )

        self.seller2 = Seller.objects.create(
            username="Test Seller 2",
            business_name="Test Seller 2",
            email="test2@example.com",
            reg_no="1234567891012",
            website="http://www.test2.com",
            feed_url="http://www.test2.com",
            no_employees=10,
            support_email="example2@gmail.com",
            landline_number="1234567891",
            address="1234 Main Street",
            city="Example City2",
            postal_code="1235",
            logo="http://www.example2.com/logo",
            instagram_link="http://www.instagram.com/example2",
            facebook_link="http://www.facebook.com/example2",
            twitter_link="http://www.twitter.com/example2",
        )

        self.product1 = Product.objects.create(
            name="Test Product 1", brand="Test Brand 1", category="Test Category 1"
        )
        self.product2 = Product.objects.create(
            name="Test Product 2", brand="Test Brand 2", category="Test Category 2"
        )
        self.product_seller1 = ProductSeller.objects.create(
            product=self.product1,
            seller=self.seller1,
            original_price=100,
            price=90,
            discount=10,
            discount_rate=0.1,
            in_stock=True,
            product_url="https://example.com/product1",
            img_array=[
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg",
            ],
        )
        self.product_seller2 = ProductSeller.objects.create(
            product=self.product2,
            seller=self.seller2,
            original_price=200,
            price=180,
            discount=20,
            discount_rate=0.1,
            in_stock=False,
            product_url="https://example.com/product2",
            img_array=[
                "https://example.com/image3.jpg",
                "https://example.com/image4.jpg",
            ],
        )

    def test_product_backend_api_view(self):
        view = ProductBackendAPIView.as_view()
        request = self.factory.get("/api/product/backend/")
        response = view(request)
        self.assertEqual(response.status_code, 200)
        data = response.data["data"]
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["name"], "Test Product 1")

    def test_get_all_products(self):
        response = self.client.get("/api/products/backend/")
        self.assertEqual(response.status_code, 200)
        data = response.data["data"]
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["name"], "Test Product 1")
        self.assertEqual(data[1]["name"], "Test Product 2")

    def test_get_specific_product(self):
        response = self.client.get(f"/api/products/backend/?prod_id={self.product1.id}")
        data = response.data["data"]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data[0]["name"], "Test Product 1")

    def test_search_products(self):
        response = self.client.get("/api/products/backend/?search=Product%201")
        self.assertEqual(response.status_code, 200)
        data = response.data["data"]
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Test Product 1")

    def test_sort_products(self):
        response = self.client.get("/api/products/backend/?sort=-price")
        self.assertEqual(response.status_code, 200)
        data = response.data["data"]
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["name"], "Test Product 2")
        self.assertEqual(data[1]["name"], "Test Product 1")

    def test_filter_products(self):
        response = self.client.get(
            "/api/products/backend/?filter_brand=Brand%201&filter_price_min=80&filter_price_max=100&filter_category=Category%201&filter_in_stock=True"
        )
        self.assertEqual(response.status_code, 200)
        data = response.data["data"]
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Test Product 1")

    def test_filter_products_by_brand(self):
        response = self.client.get(
            "/api/products/backend/?search=test&filter_brand=Brand%201"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["brand"], "Test Brand 1")

    def test_filter_products_by_price_range(self):
        response = self.client.get(
            "/api/products/backend/?search=test&filter_price_min=80&filter_price_max=100"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 1)
        self.assertAlmostEqual(response.data["data"][0]["min_price"], Decimal(90.00))

    def test_filter_products_by_category(self):
        response = self.client.get(
            "/api/products/backend/?search=test&filter_category=Category%201"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["category"], "Test Category 1")

    # def test_filter_products_by_date_range(self):
    #     date_min = timezone.now().strftime('%Y-%m-%d')
    #     date_max = (timezone.now() + timedelta(days=7)
    #                 ).strftime('%Y-%m-%d')

    # response = self.client.get(
    #     f'/api/products/backend/?search=test&filter_date_min={date_min}&filter_date_max={date_max}')
    # self.assertEqual(response.status_code, 200)
    # self.assertEqual(len(response.data['data']), 2)

    def test_filter_products_by_seller(self):
        response = self.client.get(
            f"/api/products/backend/?search=test&filter_seller={self.seller1.business_name}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 1)

    def test_pagination(self):
        response = self.client.get(
            "/api/products/backend/?search=test&page=1&per_page=1"
        )
        self.assertEqual(response.status_code, 200)
        data = response.data["data"]
        self.assertEqual(len(data), 1)


class ProductTestAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.seller1 = Seller.objects.create(
            username="Test Seller 1",
            business_name="Test Seller 1",
            email="test1@example.com",
            reg_no="1234567891011",
            website="http://www.test1.com",
            feed_url="http://www.test1.com",
            no_employees=10,
            support_email="example@gmail.com",
            landline_number="1234567890",
            address="123 Main Street",
            city="Example City",
            postal_code="1234",
            logo="http://www.example.com/logo",
            instagram_link="http://www.instagram.com/example",
            facebook_link="http://www.facebook.com/example",
            twitter_link="http://www.twitter.com/example",
        )

        self.seller2 = Seller.objects.create(
            username="Test Seller 2",
            business_name="Test Seller 2",
            email="test2@example.com",
            reg_no="1234567891012",
            website="http://www.test2.com",
            feed_url="http://www.test2.com",
            no_employees=10,
            support_email="example2@gmail.com",
            landline_number="1234567891",
            address="1234 Main Street",
            city="Example City2",
            postal_code="1235",
            logo="http://www.example2.com/logo",
            instagram_link="http://www.instagram.com/example2",
            facebook_link="http://www.facebook.com/example2",
            twitter_link="http://www.twitter.com/example2",
        )

        self.product1 = Product.objects.create(
            name="Test Product 1", brand="Test Brand 1", category="Test Category 1"
        )
        self.product2 = Product.objects.create(
            name="Test Product 2", brand="Test Brand 2", category="Test Category 2"
        )
        self.product_seller1 = ProductSeller.objects.create(
            product=self.product1,
            seller=self.seller1,
            original_price=100,
            price=90,
            discount=10,
            discount_rate=0.1,
            in_stock=True,
            product_url="https://example.com/product1",
            img_array=[
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg",
            ],
        )
        self.product_seller2 = ProductSeller.objects.create(
            product=self.product2,
            seller=self.seller2,
            original_price=200,
            price=180,
            discount=20,
            discount_rate=0.1,
            in_stock=False,
            product_url="https://example.com/product2",
            img_array=[
                "https://example.com/image3.jpg",
                "https://example.com/image4.jpg",
            ],
        )

    def test_product_test_api_view(self):
        view = ProductTestAPIView.as_view()
        request = self.factory.get("/product/test/", {"search": "Test"})
        response = view(request)
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data["data"]), 2)
        self.assertEqual(data["data"][0]["name"], "Test Product 1")

    def test_search_products(self):
        response = self.client.get("/api/products/test/?search=Product%201")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["name"], "Test Product 1")

    def test_sort_products(self):
        response = self.client.get("/api/products/test/?search=product&sort=-price")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 2)
        self.assertEqual(response.data["data"][0]["name"], "Test Product 2")
        self.assertEqual(response.data["data"][1]["name"], "Test Product 1")

    def test_filter_products(self):
        response = self.client.get(
            "/api/products/test/?search=p&filter_brand=Brand%201&filter_price_min=80&filter_price_max=100&filter_category=Category%201&filter_in_stock=True"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["name"], "Test Product 1")

    def test_pagination(self):
        response = self.client.get(
            "/api/products/test/?search=Product%201&page=0&per_page=1"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 1)

    def test_min_price(self):
        response = self.client.get("/api/products/test/")
        for product in response.data["data"]:
            min_price = product["min_price"]
            min_price_original_price = product["min_price_original_price"]
            min_price_discount_rate = product["min_price_discount_rate"]
            expected_min_price = min_price_original_price * (
                1 - min_price_discount_rate
            )
            self.assertAlmostEqual(Decimal(min_price), expected_min_price, places=2)


class ProductFrontendAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.product1 = Product.objects.create(name="Test Product 1")
        self.product2 = Product.objects.create(name="Test Product 2")

    def test_get_all_products(self):
        response = self.client.get("/api/products/frontend/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Test Product 1")
        self.assertEqual(response.data[1]["name"], "Test Product 2")

    def test_get_specific_product(self):
        response = self.client.get(
            f"/api/products/frontend/?prod_id={self.product1.id}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Test Product 1")


# class CreateAPIViewTest(TestCase):
#     API_ENDPOINT = "/products/create"  # Define a consistent API endpoint URL

#     def setUp(self):
#         # Create a test user (you may need to adjust this based on your user model)
#         self.test_user = User.objects.create(username="test_user", type="seller")

#         # Create some initial products for testing
#         self.product1 = Product.objects.create(
#             name="liverpool shirt",
#             brand="Brand A",
#             category="Category A",
#             description="Description A",
#         )
#         self.product2 = Product.objects.create(
#             name="manchester united shirt",
#             brand="Brand B",
#             category="Category B",
#             description="Description B",
#         )

#         # Create an API client
#         self.client = APIClient()

#     @patch("auth.permissions.CognitoPermission.has_permission")
#     @patch("auth.authentication.CognitoAuthentication.authenticate")
#     def test_create_product_with_existing_similar_name(
#         self, mock_authenticate, mock_has_permission
#     ):
#         mock_authenticate.return_value = (self.test_user, None)
#         mock_has_permission.return_value = True

#         data = {
#             "name": "liverpool soccer shirt",
#             "brand": "Brand C",
#             "category": "Category C",
#             "description": "Description C",
#             # Add other required fields here
#         }

#         # Perform the POST request
#         response = self.client.post(self.API_ENDPOINT, data, format="json")

#         # Check the response status code
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#         # Check if a new product was created
#         self.assertEqual(Product.objects.count(), 3)

#         # Check if a new ProductSeller relation was created
#         self.assertEqual(ProductSeller.objects.count(), 1)

#     @patch("auth.permissions.CognitoPermission.has_permission")
#     @patch("auth.authentication.CognitoAuthentication.authenticate")
#     def test_create_product_with_unique_name(
#         self, mock_authenticate, mock_has_permission
#     ):
#         mock_authenticate.return_value = (self.test_user, None)
#         mock_has_permission.return_value = True

#         data = {
#             "name": "unique product name",
#             "brand": "Brand D",
#             "category": "Category D",
#             "description": "Description D",
#             # Add other required fields here
#         }

#         # Perform the POST request
#         response = self.client.post(self.API_ENDPOINT, data, format="json")

#         # Check the response status code
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#         # Check if a new product was created
#         self.assertEqual(Product.objects.count(), 3)

#         # Check if a new ProductSeller relation was created
#         self.assertEqual(ProductSeller.objects.count(), 1)

#     @patch("auth.permissions.CognitoPermission.has_permission")
#     @patch("auth.authentication.CognitoAuthentication.authenticate")
#     def test_create_product_as_consumer(self, mock_authenticate, mock_has_permission):
#         mock_authenticate.return_value = (self.test_user, None)
#         mock_has_permission.return_value = True

#         # Change the user type to "consumer" for this test
#         self.test_user.type = "consumer"
#         self.test_user.save()

#         data = {
#             "name": "liverpool soccer shirt",
#             "brand": "Brand E",
#             "category": "Category E",
#             "description": "Description E",
#             # Add other required fields here
#         }

#         # Perform the POST request
#         response = self.client.post(self.API_ENDPOINT, data, format="json")

#         # Check the response status code
#         self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
