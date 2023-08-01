from django.test import TestCase, RequestFactory
from unittest.mock import PropertyMock, patch
from rest_framework import status
from custom_profile.views import get
from consumer.models import Consumer
from seller.models import Seller


class GetViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_get_view_consumer(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        # Create a mock request object
        request = self.factory.post("/get/")

        # Call the get view with the mock request object
        response = get(request)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the response data is correct
        expected_data = {
            "username": consumer.username,
            "email": "test@example.com",
            "type": "consumer",
            "details": {
                "wishlist": {"data": ""},
                "created_at": consumer.created_at,
                "modified_at": consumer.modified_at,
            },
        }
        self.assertEqual(response.data["username"], expected_data["username"])

    def test_get_view_seller(self):
        # Create a mock request object
        request = self.factory.post("/get/")

        # Create a mock Seller object and manually set its is_authenticated attribute to True
        seller = Seller(username="test", email="test@example.com", type="seller")
        seller.is_authenticated = True

        # Mock the request.user object
        with patch(
            "rest_framework.request.Request.user", new_callable=PropertyMock
        ) as mock_user:
            mock_user.return_value = seller

            # Call the get view with the mock request object
            response = get(request)

            # Check that the response status code is 200 OK
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # Check that the response data is correct
            expected_data = {
                "id": str(seller.id),
                "username": seller.username,
                "email": "test@example.com",
                "type": "seller",
                "details": {...},
            }
            self.assertEqual(response.data["username"], expected_data["username"])

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_get_view_no_user(self, mock_authenticate, mock_has_permission):
        # Mock the authenticate method to return None
        mock_authenticate.return_value = None

        # Mock the has_permission method to return False
        mock_has_permission.return_value = False

        # Create a mock request object
        request = self.factory.post("/get/")

        # Call the get view with the mock request object
        response = get(request)

        # Check that the response status code is 401 Unauthorized
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Check that the response data is correct
        expected_data = {"detail": "Authentication credentials were not provided."}
        self.assertDictEqual(response.data, expected_data)
