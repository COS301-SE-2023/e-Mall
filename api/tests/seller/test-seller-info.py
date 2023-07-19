from django.test import TestCase
from django.urls import reverse
from seller.models import Seller
from rest_framework.test import APIRequestFactory
from seller.views import get_seller_info
from seller.views import update_seller_info
from faker import Faker

fake = Faker()


class SellerModelTestCase(TestCase):
    def setUp(self):
        self.seller_data = {
            "email": "seller@example.com",
            "reg_no": "ABC123",
            "business_name": "Example Seller",
            "business_type": "Retail",
            "catalogue_size": 100,
            "business_category": "NONE",
            "status": "PENDING",
            "is_verified": False,
            "website": "http://www.example.com",
            "feed_url": "http://www.example.com/feed",
            "no_employees": 10,
            "support_email": "support@example.com",
            "landline_number": "1234567890",
            "address": "123 Main Street",
            "city": "Example City",
            "postal_code": "1234",
            "logo": "http://www.example.com/logo",
            "instagram_link": "http://www.instagram.com/example",
            "facebook_link": "http://www.facebook.com/example",
            "twitter_link": "http://www.twitter.com/example",
        }
        self.seller = Seller.objects.create(**self.seller_data)

    def test_seller_creation(self):
        self.assertEqual(Seller.objects.count(), 1)
        self.assertEqual(self.seller.email, self.seller_data["email"])
        # Add more assertions for other fields as needed


class GetSellerInfoViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.seller_data = {
            "email": "seller@example.com",
            # Other seller data...
        }
        self.seller = Seller.objects.create(**self.seller_data)

    def test_get_seller_info_success(self):
        url = "/api/get_seller_info/"
        request = self.factory.post(url, {"email": self.seller_data["email"]})
        response = get_seller_info(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["email"], self.seller_data["email"])
        # Add more assertions for other fields as needed

    def test_get_seller_info_not_found(self):
        url = "/api/get_seller_info/"
        request = self.factory.post(url, {"email": "nonexistent@example.com"})
        response = get_seller_info(request)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["message"], "Seller does not exist")


class UpdateSellerInfoViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.seller_data = {
            "email": "seller@example.com",
            # Other seller data...
        }
        self.seller = Seller.objects.create(**self.seller_data)

    def test_update_seller_info_success(self):
        url = "/api/update_seller_info/"
        updated_data = {
            "email": self.seller_data["email"],
            "website": "http://www.updated-example.com",
            "feed_url": "https://www.lucas-park.info/",
            "catalogue_size": fake.random_int(min=10, max=100),
            "no_employees": fake.random_int(min=1, max=250),
            "support_email": "primary@amazon.com",
            "landline_number": "0214670101",
            "address": "Wembley Square 2, 134 Solan Rd",
            "city": "Cape Town",
            "postal_code": "8001"
            # Add more updated fields as needed
        }
        request = self.factory.post(url, updated_data)
        response = update_seller_info(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Seller info updated successfully")
        self.seller.refresh_from_db()
        self.assertEqual(self.seller.catalogue_size, updated_data["catalogue_size"])
        self.assertEqual(self.seller.website, updated_data["website"])
        # Add more assertions for other updated fields as needed

    def test_update_seller_info_not_found(self):
        url = "/api/update_seller_info/"
        updated_data = {
            "email": "nonexistent@example.com",
            "website": "http://www.updated-example.com",
            "feed_url": "https://www.lucas-park.info/",
            "catalogue_size": fake.random_int(min=10, max=100),
            "no_employees": fake.random_int(min=1, max=250),
            "support_email": "primary@amazon.com",
            "landline_number": "0214670101",
            "address": "Wembley Square 2, 134 Solan Rd",
            "city": "Cape Town",
            "postal_code": "8001",
        }
        request = self.factory.post(url, updated_data)
        response = update_seller_info(request)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["message"], "Seller does not exist")
