from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from auth.authentication import CognitoAuthentication
from seller.models import Seller
from unittest.mock import MagicMock, patch


class SellerAuthTestTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch.object(CognitoAuthentication, 'authenticate')
    def test_auth_test(self, mock_authenticate):
        mock_user = MagicMock(spec=Seller)
        mock_user.is_authenticated = True
        mock_authenticate.return_value = (mock_user, None)
        response = self.client.post('/api/seller/auth_test/')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'message': 'auth success'})

    def test_auth_test_fail(self):
        response = self.client.post(
            '/api/seller/auth_test/', HTTP_AUTHORIZATION='Bearer invalid_token')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data, {'detail': 'Invalid access token'})
