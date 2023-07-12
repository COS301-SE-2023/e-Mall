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
            "seller_name": "seller",
            "product_name": "product",
            "product_category": "category",
            "consumer_id": self.consumer.id,
            "event_type": "event_type",
            "metadata": {"key": "value"},
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
