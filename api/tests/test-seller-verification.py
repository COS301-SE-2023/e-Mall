import pytest
from django.urls import reverse
from rest_framework.settings import api_settings
from rest_framework import status
from rest_framework.test import APITestCase
from seller.models import Seller


class SellerSignUpTestCase(APITestCase):
    def test_get_is_verified(self):
        url = reverse('seller-list')
        response = self.client.get(url, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
