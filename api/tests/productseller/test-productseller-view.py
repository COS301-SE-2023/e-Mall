from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from seller.models import Seller
from productseller.models import ProductSeller
from product.models import Product
from django.urls import reverse
from rest_framework import status

import json



class ProductSellerFrontendAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create test data here
        self.seller1 = Seller.objects.create(
            username="Test Seller 1",
            business_name="Test Seller 1",
            email="test1@example.com",
            reg_no="1234567891011",
            website="http://www.test1.com",
            feed_url="http://www.test1.com",
        )

        self.seller2 = Seller.objects.create(
            username="Test Seller 2",
            business_name="Test Seller 2",
            email="test2@example.com",
            reg_no="1234567891012",
            website="http://www.test2.com",
            feed_url="http://www.test2.com",
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

    def test_product_seller_frontend_api_view(self):
        response = self.client.get("/api/productseller/frontend/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["price"], "90.00")
        self.assertEqual(response.data[1]["price"], "180.00")


class ProductSellerBackendAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create test data here
        self.seller1 = Seller.objects.create(
            username="Test Seller 1",
            business_name="Test Seller 1",
            email="test1@example.com",
            reg_no="1234567891011",
            website="http://www.test1.com",
            feed_url="http://www.test1.com",
        )

        self.seller2 = Seller.objects.create(
            username="Test Seller 2",
            business_name="Test Seller 2",
            email="test2@example.com",
            reg_no="1234567891012",
            website="http://www.test2.com",
            feed_url="http://www.test2.com",
        )

        self.product1 = Product.objects.create(
            name="Test Product 1", brand="Test Brand 1", category="Test Category 1"
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
            product=self.product1,
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

    def test_get_specific_product(self):
        response = self.client.get(
            f"/api/productseller/backend/?prod_id={self.product1.id}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["price"], "90.00")
        self.assertEqual(response.data[1]["price"], "180.00")

    def test_filter_in_stock(self):
        response = self.client.get(
            f"/api/productseller/backend/?prod_id={self.product1.id}&filter_in_stock=True"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["price"], "90.00")

    def test_sort_products_price(self):
        response = self.client.get(
            f"/api/productseller/backend/?prod_id={self.product1.id}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["price"], "90.00")

    def test_sort_products_discount(self):
        response = self.client.get(
            f"/api/productseller/backend/?prod_id={self.product1.id}&sort=discount"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["discount_rate"], "0.10")



class ProductSellerProdUpdateAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.seller = Seller.objects.create(
            business_name="Test Seller"
        )  # Create a test seller
        self.product = Product.objects.create(
            name="Test Product"
        )  # Create a test product
        self.product_seller = ProductSeller.objects.create(
            seller=self.seller,  # Assign the created seller to the product seller
            product=self.product,  # Assign the created product to the product seller
            original_price=100,
            price=90,
            discount=10,
            discount_rate=0.1,
            in_stock=True,
        )

    def test_update_product_seller(self):
        data = {
            "prod_id": self.product.id,
            "seller_name": self.seller.business_name,
            "original_price": 200,
            "price": 180,
            "discount": 20,
            "discount_rate": 0.1,
            "in_stock": False,
        }
        response = self.client.post(reverse("produpdate"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(
            response_data["message"], "ProductSeller details updated successfully"
        )


class ProductSellerProdDeleteAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.seller = Seller.objects.create(business_name="Test Seller")  # Create a test seller
        self.product = Product.objects.create(name="Test Product")  # Create a test product
        self.product_seller = ProductSeller.objects.create(
            seller=self.seller,  # Assign the created seller to the product seller
            product=self.product,  # Assign the created product to the product seller
            original_price=100,
            price=90,
            discount=10,
            discount_rate=0.1,
            in_stock=True,
        )

    def test_delete_product_seller(self):
        data = {
            "prod_id": self.product.id,
            "seller_name": self.seller.business_name,
        }
        response = self.client.post(
            reverse("proddelete"), data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(
            response_data["message"], "ProductSeller deleted successfully"
        )

class ProductSellerDashboardAPIViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("sellerdashboard")

    def test_get_products_with_default_seller_name(self):
        client = APIClient()
        response = client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data as needed

    def test_get_products_with_custom_seller_name(self):
        client = APIClient()
        response = client.get(self.url, {"seller_name": "Takealot"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data as needed

    def test_get_products_with_search(self):
        client = APIClient()
        response = client.get(self.url, {"search": "product_name"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data as needed

    def test_get_products_with_numeric_search(self):
        client = APIClient()
        response = client.get(self.url, {"search": "123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data as needed

    def test_get_products_with_sorting(self):
        client = APIClient()
        response = client.get(self.url, {"sort": "price"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data as needed

    def test_get_products_with_filtering(self):
        client = APIClient()
        response = client.get(
            self.url,
            {"filter_in_stock": "True", "filter_category": "category1,,,category2"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data as needed

    def test_get_products_with_pagination(self):
        client = APIClient()
        response = client.get(self.url, {"page": 1, "per_page": 5})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data as needed

    def test_get_products_with_price_filter(self):
        client = APIClient()
        response = client.get(
            self.url, {"filter_price_min": 10, "filter_price_max": 100}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Add more assertions to validate the response data as needed

