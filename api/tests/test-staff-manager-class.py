from django.test import TestCase
from django.contrib.auth import get_user_model


class StaffManagerTestCase(TestCase):
    def setUp(self):
        self.UserModel = get_user_model()
        self.manager = self.UserModel.objects

    def test_create_user(self):
        email = 'test@example.com'
        password = 'password123'
        user = self.manager.create_user(email, password)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_create_user_no_email(self):
        with self.assertRaises(ValueError):
            self.manager.create_user(None, 'password123')

    def test_create_superuser(self):
        email = 'superuser@example.com'
        password = 'password123'
        user = self.manager.create_superuser(email, password)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_active)
