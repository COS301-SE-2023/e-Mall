import pytest
from django.urls import reverse
from rest_framework.settings import api_settings
from rest_framework import status
from rest_framework.test import APITestCase
from consumer.models import Consumer


class ConsumerSignUpTestCase(APITestCase):
    def test_get_consumers(self):
        url = reverse('consumer-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_consumer_signup_all_correct_details(self):
        """
            Ensure we can create a new account object.
            """
        url = reverse('consumer-list')
        data = {'username': 'test',
                'email': 'test@example.com', }
        response = self.client.post(url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Consumer.objects.count(), 1)
        self.assertEqual(Consumer.objects.get().type, 'consumer')

    def test_consumer_signup_incorrect_details(self):
        """
            Ensure we can create a new account object.
            """
        url = reverse('consumer-list')
        data = {'username': 'test',
                'email': 'test@',
                'type': 'user', }
        response = self.client.post(url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Consumer.objects.count(), 0)
