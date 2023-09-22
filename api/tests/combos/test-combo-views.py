import json
from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from product.serializers import ProductSerializer
from consumer.models import Consumer
from product.models import Product
from combos.models import Combos
from combos.views import (
    create,
    invite,
    delete,
    get,
    update_user,
    edit,
    removeProduct,
    getInvites,
    addProduct,
)
from unittest.mock import PropertyMock, patch
from rest_framework import status
from django.urls import reverse

class ComboViewsTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_create_combo(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        data = {
            "combo_name": "Test Combo",
            "user_emails": ["test@example.com"],
            "product_ids": [1, 2],
        }
        # Convert the data dictionary to a JSON string
        json_data = json.dumps(data)
        request = self.factory.post("/create/", json_data, content_type="application/json")
        response = create(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Combos.objects.count(), 1)


class UpdateUserAcceptViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_accept_action(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        # Create a Combo object 
        combo = Combos(combo_name="Test Combo", user_emails=["t@example.com"], product_ids=[1, 2], pending_emails=[consumer.email])
        combo.save()
        data = {"collection_id": combo.id,
                "action": "Accept"}
        json_data = json.dumps(data)
        request = self.factory.post("/update_user/", json_data, content_type="application/json")
        response = update_user(request)
        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the user email is removed from pending_emails
        combo.refresh_from_db()
        self.assertNotIn(consumer.email, combo.pending_emails)

        # Check that the user email is added to user_emails
        self.assertIn(consumer.email, combo.user_emails)

        # Check for a success message in the response content
        self.assertContains(response, "User added to Combo successfully")


class UpdateUserRejectViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_reject_action(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        # Create a Combo object 
        combo = Combos(combo_name="Test Combo", user_emails=["t@example.com"], product_ids=[1, 2], pending_emails=[consumer.email])
        combo.save()
        data = {"collection_id": combo.id,
                "action": "Reject"}
        json_data = json.dumps(data)
        request = self.factory.post("/update_user/", json_data, content_type="application/json")
        response = update_user(request)
        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the user email is removed from pending_emails
        combo.refresh_from_db()
        self.assertNotIn(consumer.email, combo.pending_emails)

        # Check for a success message in the response content
        self.assertContains(response, "User removed from pending emails successfully")

class InviteViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_invite_action(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        # Create a Combo object 
        combo = Combos(combo_name="Test Combo", user_emails=["t@example.com"], product_ids=[1, 2], pending_emails=[consumer.email])
        combo.save()

        data = {"collection_id": combo.id,
                "user_emails": ["test@example.com"]}
        
        json_data = json.dumps(data)
        request = self.factory.post("/invite/", json_data, content_type="application/json")
        response = invite(request)

        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the user emails are added to pending_emails
        combo.refresh_from_db()
        self.assertIn("test@example.com", combo.pending_emails)

        # Check for a success message in the response content
        self.assertContains(response, "Combo updated successfully")

class RemoveProductViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_remove_action(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        # Create a Combo object 
        combo = Combos(combo_name="Test Combo", user_emails=["t@example.com"], product_ids=[1, 2,5], pending_emails=[consumer.email])
        combo.save()

        data = {
            "collection_id": combo.id,
            "product_id": 5,
        }
        json_data = json.dumps(data)
        request = self.factory.post("/remove_product/", json_data, content_type="application/json")
        response = removeProduct(request)

        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the product is removed from the combo's product_ids
        combo.refresh_from_db()
        self.assertNotIn(5, combo.product_ids)

        # Check for a success message in the response content
        self.assertContains(response, "Combo updated successfully")

class EditViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_edit_action(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        # Create a Combo object 
        combo = Combos(combo_name="Test Combo", user_emails=["t@example.com"], product_ids=[1, 2,5], pending_emails=[consumer.email])
        combo.save()
        new_combo_name = "New Combo Name"
        data = {
            "collection_id": combo.id,
            "combo_name": new_combo_name,
        }
        json_data = json.dumps(data)
        request = self.factory.post("/edit/", json_data, content_type="application/json")
        response = edit(request)

        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the combo's name is updated
        combo.refresh_from_db()
        self.assertEqual(combo.combo_name, new_combo_name)

        # Check for a success message in the response content
        self.assertContains(response, "Combo edited successfully")

class DeleteViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_delete_action(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        # Create a Combo object 
        combo = Combos(combo_name="Test Combo", user_emails=[consumer.email], product_ids=[1, 2,5], pending_emails=[consumer.email])
        combo.save()
        data = {
            "collection_id": combo.id,
        }
        json_data = json.dumps(data)
        request = self.factory.post("/delete/", json_data, content_type="application/json")
        response = delete(request)

        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the combo is deleted
        self.assertEqual(Combos.objects.filter(id=combo.id).count(), 0)

        # Check for a success message in the response content
        self.assertContains(response, "Combo deleted successfully")

class GetViewTestCase(TestCase): 
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_get_action(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

         # Create some sample products
        product1 = Product.objects.create(name="Product 1")
        product2 = Product.objects.create(name="Product 2")

        # Create some sample users
        user1 = Consumer.objects.create(username="user1", email="user1@example.com")
        user2 = Consumer.objects.create(username="user2", email="user2@example.com")

        # Create a Combo object 
        combo = Combos(combo_name="Test Combo", user_emails=[consumer.email,user1.email,user2.email], product_ids=[product1.id,product2.id], pending_emails=[])
        combo.save()
        data = {}
        json_data = json.dumps(data)
        request = self.factory.post("/get/", json_data, content_type="application/json")
        response = get(request)

        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check the response content for combo data
        combo_data = response.data.get("combos", [])
        self.assertEqual(len(combo_data), 1)  # Assuming only one combo was created
        combo_data = combo_data[0]  # Assuming only one combo was created

        # Check the combo data attributes
        self.assertEqual(combo_data["id"], combo.id)
        self.assertEqual(combo_data["name"], combo.combo_name)
        self.assertEqual(combo_data["products"], ProductSerializer([product1, product2], many=True).data)
        self.assertEqual(combo_data["active_usernames"], [user1.username, user2.username])
        self.assertEqual(combo_data["active_emails"], [consumer.email, user1.email, user2.email])
        self.assertEqual(combo_data["pending_users"], [])


class GetInvitesViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_get_invites_action(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        # Create a Combo object 
        combo1 = Combos(combo_name="Pending Combo", user_emails=["test@g.com"], product_ids=[1, 2,5], pending_emails=[consumer.email])
        combo1.save()
        combo2 = Combos(combo_name="Pending Combo", user_emails=["test@g.com"], product_ids=[1, 2,5], pending_emails=[consumer.email])
        combo2.save()
        data={}
        json_data = json.dumps(data)
        request = self.factory.post("/get_invites/", json_data, content_type="application/json")
        response = getInvites(request)

        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check the response content for combo data
        combo_data = response.data.get("combos", [])
        self.assertEqual(len(combo_data), 2)  # Assuming two combos were created

        # Check the combo data attributes
        combo_names = [combo["name"] for combo in combo_data]
        self.assertIn(combo1.combo_name, combo_names)
        self.assertIn(combo2.combo_name, combo_names)

class AddProductViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_add_product(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        product = Product.objects.create(name="Product 1")
        # Create a Combo object 
        combo1 = Combos(combo_name="Combo 1", user_emails=[consumer.email], product_ids=[2], pending_emails=["test@g.com"])
        combo1.save()
        combo2 = Combos(combo_name="Combo 2", user_emails=[consumer.email], product_ids=[2], pending_emails=["test@g.com"])
        combo2.save()
        # Data for the request
        data = {
            "collection_ids": [combo1.id, combo2.id],
            "product_id": product.id,
        }
        json_data = json.dumps(data)
        request = self.factory.post("/add_product/", json_data, content_type="application/json")
        response = addProduct(request)

        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check the response content for combo data
        # Check that the product is added to both combos
        combo1.refresh_from_db()
        combo2.refresh_from_db()
        self.assertIn(product.id, combo1.product_ids)
        self.assertIn(product.id, combo2.product_ids)

        # Check for a success message in the response content
        self.assertContains(response, "Product added to combo successfully")