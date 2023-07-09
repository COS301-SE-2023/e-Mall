from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from consumer.models import Consumer


class ConsumerViewTest(TestCase):
    def test_register(self):
        url = reverse('consumer_register')
        data = {
            'email': 'test@example.com',
            'type': 'consumer'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'],
                         'Consumer registered successfully')
        self.assertTrue(Consumer.objects.filter(
            email='test@example.com').exists())

    def test_register_invalid_data(self):
        url = reverse('consumer_register')
        data = {
            'email': 'invalid-email',
            'type': 'invalid-type'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
