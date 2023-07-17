# from django.test import TestCase
# from django.contrib.auth.models import User
# from rest_framework.test import APIRequestFactory, force_authenticate
# from custom_profile.views import get, update
# from consumer.models import Consumer
# from seller.models import Seller


# class ProfileViewTest(TestCase):
#     def setUp(self):
#         self.factory = APIRequestFactory()
#         self.consumer = Consumer.objects.create(
#             username='test', email='test@example.com', type='consumer')
#         self.seller = Seller.objects.create(
#             username='test', email='test@example.com', type='seller')

#     def test_get_consumer(self):
#         # Create a request
#         request = self.factory.post('/get/')
#         force_authenticate(request, user=self.consumer)

#         # Call the view
#         response = get(request)

#         # Check the response
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.data, {
#             'id': self.consumer.id,
#             'username': 'test',
#             'email': 'test@example.com',
#             'type': 'consumer',
#             'details': {
#                 'wishlist': None,
#                 'created_at': None,
#                 'modified_at': None,
#             }
#         })

#     def test_get_seller(self):
#         # Create a request
#         request = self.factory.post('/get/')
#         force_authenticate(request, user=self.seller)

#         # Call the view
#         response = get(request)

#         # Check the response
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.data, {
#             'id': self.seller.id,
#             'username': 'test',
#             'email': 'test@example.com',
#             'type': 'seller',
#             'details': {
#                 'reg_no': None,
#                 'business_name': None,
#                 'business_type': None,
#                 'business_category': None,
#                 'catalogue_size': None,
#                 'status': None,
#                 'is_verified': None,
#                 'website': None,
#                 'feed_url': None,
#                 'no_employees': None
#             }
#         })

#     def test_get_unauthenticated(self):
#         # Create a request
#         request = self.factory.post('/get/')

#         # Call the view
#         response = get(request)

#         # Check the response
#         self.assertEqual(response.status_code, 500)
#         self.assertEqual(response.data, {'error': 'User not found'})

#     def test_update_consumer(self):
#         # Create a request
#         data = {
#             'username': 'updated',
#             'details': {
#                 'wishlist': [1, 2, 3]
#             }
#         }
#         request = self.factory.post('/update/', data)
#         force_authenticate(request, user=self.consumer)

#         # Call the view
#         response = update(request)

#         # Check the response
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.data, {
#             'id': self.consumer.id,
#             'username': 'updated',
#             'email': 'test@example.com',
#             'type': 'consumer',
#             'details': {
#                 'wishlist': [1, 2, 3],
#                 'created_at': None,
#                 'modified_at': None,
#             }
#         })

#     def test_update_seller(self):
#         # Create a request
#         data = {
#             'username': 'updated',
#             'details': {
#                 'business_name': 'updated'
#             }
#         }
#         request = self.factory.post('/update/', data)
#         force_authenticate(request, user=self.seller)

#         # Call the view
#         response = update(request)

#         # Check the response
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.data, {
#             'id': self.seller.id,
#             'username': 'updated',
#             'email': 'test@example.com',
#             'type': 'seller',
#             'details': {
#                 'reg_no': None,
#                 'business_name': 'updated',
#                 'business_type': None,
#                 'business_category': None,
#                 'catalogue_size': None,
#                 'status': None,
#                 'is_verified': None,
#                 'website': None,
#                 'feed_url': None,
#                 'no_employees': None
#             }
#         })

#     def test_update_unauthenticated(self):
#         # Create a request
#         data = {
#             'username': 'updated',
#             'details': {
#                 'wishlist': [1, 2, 3]
#             }
#         }
#         request = self.factory.post('/update/', data)

#         # Call the view
#         response = update(request)

#         # Check the response
#         self.assertEqual(response.status_code, 500)
#         self.assertEqual(response.data, {'error': 'User not found'})

#     def test_update_invalid_data(self):
#         # Create a request
#         data = {
#             'username': '',
#             'details': {
#                 'wishlist': [1, 2, 3]
#             }
#         }
#         request = self.factory.post('/update/', data)
#         force_authenticate(request, user=self.consumer)

#         # Call the view
#         response = update(request)

#         # Check the response
#         self.assertEqual(response.status_code, 400)
