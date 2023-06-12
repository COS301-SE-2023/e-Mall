# import pytest
# from django.urls import reverse
# from rest_framework.settings import api_settings
# from rest_framework import status
# from rest_framework.test import APITestCase
# from seller.models import Seller


# class SellerSignUpTestCase(APITestCase):
#     def test_get_sellers(self):
#         """
#             Ensure we can create a new account object.
#             """
#         url = reverse('seller-list')
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_seller_signup_all_correct_details(self):
#         """
#             Ensure we can create a new account object.
#             """
#         url = reverse('seller-list')
#         data = {'username': 'test',
#                 'email': 'test@example.com',
#                 'type': 'seller',
#                 'reg_no': '1234567890',
#                 'business_name': 'Test Business',
#                 'business_type': 'Test Type',
#                 'catalogue_size': 200,
#                 'business_category': 'MICRO',
#                 'status': 'PENDING',
#                 'is_verified': False,
#                 'website': 'https://www.bing.com/',
#                 'feed_url': 'https://www.bing.com/', }
#         response = self.client.post(url, data, format='json')
#         print(response.content)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Seller.objects.count(), 1)
#         self.assertEqual(Seller.objects.get().username, 'test')

#     def test_seller_signup_incorrect_details(self):
#         """
#             Ensure we can create a new account object.
#             """
#         url = reverse('seller-list')
#         data = {'username': 'test',
#                 'email': 'test',
#                 'type': 'seller',
#                 'reg_no': '1234567890',
#                 'business_name': 'Test Business',
#                 'business_type': 'Test Type',
#                 'catalogue_size': 200,
#                 'business_category': 'MICRO',
#                 'status': 'PENDING',
#                 'is_verified': False,
#                 'website': 'https://www.google.com/',
#                 'feed_url': 'https://www.google.com/', }
#         response = self.client.post(url, data, format='json')
#         print(response.content)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertEqual(Seller.objects.count(), 0)
