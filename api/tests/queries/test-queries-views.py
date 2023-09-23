from rest_framework import status
from queries.views import getQueries, create, UpdateQuery
import json
from consumer.models import Consumer
from seller.models import Seller
from queries.models import Query
from django.test import TestCase, RequestFactory
from unittest.mock import PropertyMock, patch
from rest_framework import status
from django.urls import reverse
from django.utils.timezone import now

class QueriesViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_create_query(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        consumer = Consumer(username="test", email="test@example.com", type="consumer")
        mock_authenticate.return_value = (consumer, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        data={
            "product_id": 1,
            "seller_email": "test@g.com",
            "query_option": "price",


        }
        # Convert the data dictionary to a JSON string
        json_data = json.dumps(data)
        request = self.factory.post("/create/", json_data, content_type="application/json")
        response = create(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Query.objects.count(), 1)

class QueriesGetViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_get_query(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        seller = Seller(username="test", email="test@example.com", type="seller")
        mock_authenticate.return_value = (seller, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True

        # Create some sample queries for the seller
        query1 = Query.objects.create(
            product_id=1,
            user_email="user1@example.com",
            seller_email=seller.email,
            query_option="price",
            status="Pending",
            event_date = now()
        )

        query2 = Query.objects.create(
            product_id=2,
            user_email="user2@example.com",
            seller_email=seller.email,
            query_option="price",
            status="Resolved",
            event_date= now()
        )

        data={}
        # Convert the data dictionary to a JSON string
        json_data = json.dumps(data)
        request = self.factory.post("/get/", json_data, content_type="application/json")
        response = getQueries(request)
        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        query1.refresh_from_db()
        query2.refresh_from_db()
       # Check the response content for query data
        query_data = response.data.get("queries", [])
        self.assertEqual(len(query_data), 2)  # Assuming two queries were created
        # Check the query data attributes for the first query
        self.assertEqual(query_data[0]["id"], query1.id)
        self.assertEqual(query_data[0]["product_id"], query1.product_id)
        self.assertEqual(query_data[0]["user_email"], query1.user_email)
        self.assertEqual(query_data[0]["seller_email"], query1.seller_email)
        self.assertEqual(query_data[0]["query_option"], query1.query_option)
        self.assertEqual(query_data[0]["status"], query1.status)

        # Check the query data attributes for the second query
        self.assertEqual(query_data[1]["id"], query2.id)
        self.assertEqual(query_data[1]["product_id"], query2.product_id)
        self.assertEqual(query_data[1]["user_email"], query2.user_email)
        self.assertEqual(query_data[1]["seller_email"], query2.seller_email)
        self.assertEqual(query_data[1]["query_option"], query2.query_option)
        self.assertEqual(query_data[1]["status"], query2.status) 

class QueriesUpdateTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("auth.permissions.CognitoPermission.has_permission")
    @patch("auth.authentication.CognitoAuthentication.authenticate")
    def test_update_query(self, mock_authenticate, mock_has_permission):
        # Create a mock Consumer object and manually set its is_authenticated attribute to True
        seller = Consumer(username="test", email="test@example.com", type="seller")
        mock_authenticate.return_value = (seller, None)

        # Mock the has_permission method to return True
        mock_has_permission.return_value = True
        # Create a sample query for the seller
        query = Query.objects.create(
            product_id=1,
            user_email="user@example.com",
            seller_email=seller.email,
            query_option="Option 1",
            status="Pending",
        )

        # Data for the request to update the query
        data = {
            "id": query.id,
            "status": "Resolved",
        }

        # Convert the data dictionary to a JSON string
        json_data = json.dumps(data)
        request = self.factory.post("/update/", json_data, content_type="application/json")
        response = UpdateQuery(request)
        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh the query from the database to get the updated status
        query.refresh_from_db()

        # Check that the query status has been updated
        self.assertEqual(query.status, "Resolved")