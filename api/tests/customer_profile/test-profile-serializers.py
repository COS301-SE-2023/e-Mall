from django.test import TestCase
from consumer.models import Consumer
from seller.models import Seller
from custom_profile.serializers import ConsumerProfileSerializer, SellerProfileSerializer
from django.utils.dateformat import format


# class ProfileSerializerTest(TestCase):

#     def test_consumer_profile_serializer(self):
#         # Create an instance of the Consumer model
#         consumer = Consumer.objects.create(
#             username='test', email='test@example.com', type='consumer')

#         # Serialize the model instance
#         serializer = ConsumerProfileSerializer(consumer)

#         # Check that the serialized data is correct
#         expected_data = {
#             'id': str(consumer.id),
#             'username': consumer.username,
#             'email': 'test@example.com',
#             'type': 'consumer',
#             'details': {
#                 'wishlist': {'data': ''},
#                 'created_at': format(consumer.created_at, 'c'),
#                 'modified_at': format(consumer.modified_at, 'c'),
#             }
#         }
#         self.assertEqual(serializer.data, expected_data)
# def test_seller_profile_serializer(self):
#     # Create an instance of the Seller model
#     seller = Seller.objects.create(
#         username='test', email='test@example.com', type='seller')

#     # Serialize the model instance
#     serializer = SellerProfileSerializer(seller)

#     # Check that the serialized data is correct
#     expected_data = {
#         'id': seller.id,
#         'username': 'test',
#         'email': 'test@example.com',
#         'type': 'seller',
#         'details': {
#             'reg_no': None,
#             'business_name': None,
#             'business_type': None,
#             'business_category': None,
#             'catalogue_size': None,
#             'status': None,
#             'is_verified': None,
#             'website': None,
#             'feed_url': None,
#             'no_employees': None
#         }
#     }
#     self.assertEqual(serializer.data, expected_data)
