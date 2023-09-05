from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory
from consumer.models import Consumer
from combos.models import Combos
from combos.views import create, update, delete
from unittest.mock import PropertyMock, patch


# class ComboViewsTestCase(TestCase):
#     def setUp(self):
#         self.factory = RequestFactory()

#     @patch("auth.permissions.CognitoPermission.has_permission")
#     @patch("auth.authentication.CognitoAuthentication.authenticate")
#     def test_create_combo(self, mock_authenticate, mock_has_permission):
#         # Create a mock Consumer object and manually set its is_authenticated attribute to True
#         consumer = Consumer(username="test", email="test@example.com", type="consumer")
#         mock_authenticate.return_value = (consumer, None)

#         # Mock the has_permission method to return True
#         mock_has_permission.return_value = True

#         data = {
#             "combo_name": "Test Combo",
#             "user_emails": ["test@example.com"],
#             "product_ids": [1, 2],
#         }
#         request = self.factory.post("/create/", data, format="json")
#         response = create(request)
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(Combos.objects.count(), 1)

# def test_update_combo(self):
#     combo = Combos.objects.create(
#         combo_name='Initial Combo',
#         user_emails=['test@example.com'],
#         product_ids=[1, 2, 3],
#     )
#     data = {
#         'combo_id': combo.id,
#         'combo_name': 'Updated Combo',
#         'user_emails': ['test@example.com', 'test2@example.com'],
#         'product_ids': [4, 5, 6],
#     }
#     request = self.factory.post('/update/', data, format='json')
#     request.user = self.user
#     response = update(request)
#     self.assertEqual(response.status_code, 200)
#     combo.refresh_from_db()
#     self.assertEqual(combo.combo_name, 'Updated Combo')
#     self.assertEqual(combo.user_emails, ['test@example.com', 'test2@example.com'])
#     self.assertEqual(combo.product_ids, [4, 5, 6])

# def test_delete_combo(self):
#     combo = Combos.objects.create(
#         combo_name='Test Combo',
#         user_emails=['test@example.com'],
#         product_ids=[1, 2, 3],
#     )
#     data = {
#         'combo_id': combo.id,
#     }
#     request = self.factory.post('/delete/', data, format='json')
#     request.user = self.user
#     response = delete(request)
#     self.assertEqual(response.status_code, 200)
#     self.assertEqual(Combos.objects.count(), 0)

# def test_delete_user_from_combo(self):
#     combo = Combos.objects.create(
#         combo_name='Test Combo',
#         user_emails=['test@example.com', 'test2@example.com'],
#         product_ids=[1, 2, 3],
#     )
#     self.user.email = 'test@example.com'
#     self.user.save()
#     data = {
#         'combo_id': combo.id,
#     }
#     request = self.factory.post('/delete/', data, format='json')
#     request.user = self.user
#     response = delete(request)
#     self.assertEqual(response.status_code, 200)
#     combo.refresh_from_db()
#     self.assertEqual(combo.user_emails, ['test2@example.com'])
