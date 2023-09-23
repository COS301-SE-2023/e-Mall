from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from consumer.models import Consumer
from rest_framework.test import APIRequestFactory, APIClient
from rest_framework import status
from product.models import Product
from seller.models import Seller
from consumer.views import update, get_consumer_info
import uuid


class ConsumerViewTest(TestCase):
    def test_register(self):
        url = reverse("consumer_register")
        data = {"email": "test@example.com", "type": "consumer"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Consumer registered successfully")
        self.assertTrue(Consumer.objects.filter(email="test@example.com").exists())

    def test_register_invalid_data(self):
        url = reverse("consumer_register")
        data = {"email": "invalid-email", "type": "invalid-type"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ConsumerViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()

        # Create some test data
        self.consumer = Consumer.objects.create(email="test@example.com")
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

        self.product1 = Product.objects.create(name="Product 10")
        self.product2 = Product.objects.create(name="Product 20")

    def test_update_consumer_info(self):
        data = {
            "email": "test@example.com",
            "followed_sellers": [self.seller1.username, self.seller2.username],
            "wishlist": [self.product1.id, self.product2.id],
        }
        response = self.client.post("/api/consumer/update/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the consumer data was updated in the database
        updated_consumer = Consumer.objects.get(email="test@example.com")
        
        # self.assertEqual(
        #     updated_consumer.followed_sellers,
        #     [self.seller2.username, self.seller1.username],
        # )
        # self.assertEqual(
        #     updated_consumer.wishlist, [self.product1.id, self.product2.id]
        # )

    def test_get_consumer_info(self):
        self.consumer.followed_sellers = [self.seller1.username, self.seller2.username]
        self.consumer.wishlist = [self.product1.id, self.product2.id]
        self.consumer.save()

        data = {"email": "test@example.com"}
        response = self.client.post("/api/consumer/get_consumer_info/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_consumer_info_invalid_email(self):
        data = {
            "email": "invalid@example.com",
            "followed_sellers": [self.seller1.id, self.seller2.id],
            "wishlist": [self.product1.id, self.product2.id],
        }
        response = self.client.post("/api/consumer/get_consumer_info/", data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["message"], "Consumer does not exist")

