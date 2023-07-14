from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from analytics.models import Analytics
from consumer.models import Consumer
import uuid


class AnalyticsModelTest(TestCase):
    def setUp(self):
        consumer = Consumer.objects.create(
            username="consumer",
            email="examp[le.com",
            type="consumer",
            wishlist="null",
        )
        self.analytics = Analytics.objects.create(
            seller="seller",
            product="product",
            product_category="category",
            consumer_id=consumer.id,
            event_type="event_type",
        )

    def test_analytics_model(self):
        self.assertEqual(
            str(self.analytics), "Analytics object (" + str(self.analytics.id) + ")"
        )


class ProductAnalyticsAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("productanalytics")

    def test_product_analytics_api_view(self):
        response = self.client.get(self.url, {"seller_name": "seller"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AllProductAnalyticsAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("allproductanalytics")

    def test_all_product_analytics_api_view(self):
        response = self.client.get(self.url, {"seller_name": "seller"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CreateProductAnalyticsAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("createproductanalytics")
        self.consumer = Consumer.objects.create(username="consumer")

    def test_create_product_analytics_api_view(self):
        data = {
            "seller": "seller",
            "product": "product",
            "product_category": "category",
            "consumer_id": self.consumer.id,
            "event_type": "event_type",
            "metadata": {"key": "value"},
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ConversionRateAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("conversionrate")
        self.consumer = Consumer.objects.create(username="consumer")
        # Create test data
        Analytics.objects.create(
            seller="seller1",
            product="product1",
            consumer_id=self.consumer.id,
            event_type="product_click",
        )
        Analytics.objects.create(
            seller="seller1",
            product="product1",
            consumer_id=self.consumer.id,
            event_type="link_click",
        )
        Analytics.objects.create(
            seller="seller1",
            product="product2",
            consumer_id=self.consumer.id,
            event_type="product_click",
        )
        Analytics.objects.create(
            seller="seller1",
            product="product2",
            consumer_id=self.consumer.id,
            event_type="link_click",
        )

    def test_conversion_rate_api_view(self):
        # Send GET request to the API view
        response = self.client.get(self.url, {"seller_name": "seller1"})

        # Verify the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify the response data
        expected_data = [
            {"product_name": "product1", "conversion_rate": 100},
            {"product_name": "product2", "conversion_rate": 100},
        ]
        self.assertEqual(response.data, expected_data)
