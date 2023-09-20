from django.test import RequestFactory, TestCase
from unittest.mock import MagicMock, patch
from rest_framework import status
from consumer.models import Consumer
from notification.views import *
from mockfirestore import MockFirestore


class MockBatch:
    def __init__(self):
        self._deletes = []
        self._reads = []

    def delete(self, ref):
        self._deletes.append(ref)

    def update(self, ref):
        self._reads.append(ref)

    def commit(self):
        # You can add logic here to simulate what should happen when commit is called
        pass


class MyMockFirestore(MockFirestore):
    def batch(self):
        return MockBatch()


class TestSendMessageAPI(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(
            id="test1234", username="test", email="test@example.com", type="consumer"
        )
        self.mock_authenticate = patch(
            "auth.authentication.CognitoAuthentication.authenticate"
        ).start()
        self.mock_has_permission = patch(
            "auth.permissions.CognitoPermission.has_permission"
        ).start()
        self.mock_db = patch(
            "notification.views.db", new_callable=MockFirestore
        ).start()

        # Ensure authenticate returns a user and a token (None in this case)
        self.mock_authenticate.return_value = (self.consumer, None)
        self.mock_has_permission.return_value = True

    def tearDown(self):
        patch.stopall()

    def test_send_message_api_success_user(self):
        self._test_send_message_api_success("user")

    def test_send_message_api_success_query(self):
        self._test_send_message_api_success("query")

    def test_send_message_api_success_wishlist(self):
        self._test_send_message_api_success("wishlist")

    def test_send_message_api_success_follower(self):
        self._test_send_message_api_success("follower")

    def test_send_message_api_failure_invalid_msg_type(self):
        self._test_send_message_api_failure()

    def _test_send_message_api_success(self, msg_type):
        user = self.consumer
        self.api_client.user = user

        request = self.api_client.post(
            "/api/notification/create/",
            {
                "target": user.id,
                "message_type": msg_type,
                "image": "test_image",
                "message": "test_message",
                "title": "test_title",
            },
        )

        response = send_message_api(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")

    def _test_send_message_api_failure(self):
        user = self.consumer
        self.api_client.user = user

        request = self.api_client.post(
            "/api/notification/create/",
            {
                "target": user.id,
                "message_type": "invalid_msg_type",
                "image": "test_image",
                "message": "test_message",
                "title": "test_title",
            },
        )

        response = send_message_api(request)

        self.assertEqual(response.status_code, 400)


class TestDeleteAPI(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(
            id="test1234", username="test", email="test@example.com", type="consumer"
        )
        self.mock_authenticate = patch(
            "auth.authentication.CognitoAuthentication.authenticate"
        ).start()
        self.mock_has_permission = patch(
            "auth.permissions.CognitoPermission.has_permission"
        ).start()
        self.mock_db = patch(
            "notification.views.db", new_callable=MockFirestore
        ).start()

        # Ensure authenticate returns a user and a token (None in this case)
        self.mock_authenticate.return_value = (self.consumer, None)
        self.mock_has_permission.return_value = True

    def tearDown(self):
        patch.stopall()

    def test_delete_success(self):
        # Mock Firestore document to be deleted
        user = self.consumer
        self.api_client.user = user
        mock_document = MagicMock()
        mock_document.delete = MagicMock()  # Add a delete method to the mock document

        self.mock_db.collection("users").document(user.id).collection("logs").document(
            "test_notification1"
        ).return_value = mock_document
        request = self.api_client.post(
            "/api/notification/delete/", {"notification_id": "test_notification1"}
        )
        response = delete(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")

    def test_delete_failure(self):
        user = self.consumer
        self.api_client.user = user

        mock_document = MagicMock()
        mock_document.delete.side_effect = Exception("Firestore error")
        self.mock_db.collection("users").document("test1234").collection(
            "logs"
        ).document("test_notification1").return_value = mock_document

        request = self.api_client.post("/api/notification/delete/", {})
        response = delete(request)

        self.assertEqual(response.status_code, 400)


class TestDeleteAllAPI(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(
            id="test1234", username="test", email="test@example.com", type="consumer"
        )
        self.mock_authenticate = patch(
            "auth.authentication.CognitoAuthentication.authenticate"
        ).start()
        self.mock_has_permission = patch(
            "auth.permissions.CognitoPermission.has_permission"
        ).start()
        # self.mock_db = patch("notification.views.db", new_callable=MockFirestore).start()
        self.mock_db = patch(
            "notification.views.db", new_callable=MyMockFirestore
        ).start()
        # Ensure authenticate returns a user and a token (None in this case)
        self.mock_authenticate.return_value = (self.consumer, None)
        self.mock_has_permission.return_value = True

    def tearDown(self):
        patch.stopall()

    def test_delete_success(self):
        # Mock Firestore document to be deleted
        user = self.consumer
        self.api_client.user = user
        mock_document = MagicMock()
        mock_stream = MagicMock()
        mock_stream.return_value = [mock_document]
        # Mock the Firestore collection and document hierarchy
        self.mock_db.collection("users").document(user.id).collection(
            "logs"
        ).stream = mock_stream

        request = self.api_client.post("/api/notification/delete/all/", {})
        response = delete_all(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")

    def test_delete_all_failure(self):
        user = self.consumer
        self.api_client.user = user

        self.mock_db.batch = MagicMock(side_effect=Exception("Firestore error"))

        request = self.api_client.post("/api/notification/delete/all/", {})
        response = delete_all(request)

        self.assertEqual(response.status_code, 400)


class TestReadAllAPI(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(
            id="test1234", username="test", email="test@example.com", type="consumer"
        )
        self.mock_authenticate = patch(
            "auth.authentication.CognitoAuthentication.authenticate"
        ).start()
        self.mock_has_permission = patch(
            "auth.permissions.CognitoPermission.has_permission"
        ).start()
        self.mock_db = patch(
            "notification.views.db", new_callable=MyMockFirestore
        ).start()

        # Ensure authenticate returns a user and a token (None in this case)
        self.mock_authenticate.return_value = (self.consumer, None)
        self.mock_has_permission.return_value = True

    def tearDown(self):
        patch.stopall()

    def test_read_all_success(self):
        user = self.consumer
        self.api_client.user = user
        mock_document = MagicMock()
        mock_stream = MagicMock()
        mock_stream.return_value = [mock_document]
        # Mock the Firestore collection and document hierarchy
        self.mock_db.collection("users").document(user.id).collection("logs").where(
            "is_read", "==", False
        ).stream = mock_stream

        request = self.api_client.post("/api/notification/read/all/", {})
        response = read_all(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")

    def test_read_all_failure(self):
        user = self.consumer
        self.api_client.user = user

        # Mock db.batch() to raise an exception
        self.mock_db.batch = MagicMock(side_effect=Exception("Firestore error"))

        request = self.api_client.post("/api/notification/read/all/", {})
        response = read_all(request)

        self.assertEqual(response.status_code, 400)


class TestReadAPI(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(
            id="test1234", username="test", email="test@example.com", type="consumer"
        )
        self.mock_authenticate = patch(
            "auth.authentication.CognitoAuthentication.authenticate"
        ).start()
        self.mock_has_permission = patch(
            "auth.permissions.CognitoPermission.has_permission"
        ).start()
        self.mock_db = patch(
            "notification.views.db", new_callable=MockFirestore
        ).start()

        # Ensure authenticate returns a user and a token (None in this case)
        self.mock_authenticate.return_value = (self.consumer, None)
        self.mock_has_permission.return_value = True

    def tearDown(self):
        patch.stopall()

    def test_read_success(self):
        user = self.consumer
        self.api_client.user = user
        mock_document1 = MagicMock()
        mock_document1.to_dict.return_value = {
            "id": "document1",
            "image": "image1",
            "is_read": True,
            "message": "test message 1",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:17:28 PM UTC+2",
            "title": "Wishlist alert",
        }

        # Mock the Firestore collection and document hierarchy
        self.mock_db.collection("users").document(user.id).collection("logs").document(
            "123"
        ).set(mock_document1)
        request = self.api_client.post(
            "/api/notification/read/", {"notification_id": "123"}
        )
        response = read(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")
        # Check if is_read field for document 1 has been changed to True
        updated_document1 = (
            self.mock_db.collection("users")
            .document(user.id)
            .collection("logs")
            .document("123")
            .get()
        )
        self.assertTrue(updated_document1.to_dict()["is_read"])

    def test_read_failure(self):
        user = self.consumer
        self.api_client.user = user

        # Mock db.collection().document().collection().document().update to raise an exception
        mock_document_update = MagicMock(side_effect=Exception("Firestore error"))
        self.mock_db.collection("users").document(user.id).collection(
            "logs"
        ).document().update = mock_document_update

        request = self.api_client.post("/api/notification/read/", {})
        response = read(request)

        self.assertEqual(response.status_code, 400)


class TestGetAPI(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(
            id="test1234", username="test", email="test@example.com", type="consumer"
        )
        self.mock_authenticate = patch(
            "auth.authentication.CognitoAuthentication.authenticate"
        ).start()
        self.mock_has_permission = patch(
            "auth.permissions.CognitoPermission.has_permission"
        ).start()
        self.mock_db = patch(
            "notification.views.db", new_callable=MockFirestore
        ).start()
        # self.patcher = patch.object(get, 'page_size', new=2).start()
        # Ensure authenticate returns a user and a token (None in this case)
        self.mock_authenticate.return_value = (self.consumer, None)
        self.mock_has_permission.return_value = True

        user = self.consumer
        self.api_client.user = user

        mock_document1 = MagicMock()
        mock_document1.to_dict.return_value = {
            "id": "document1",
            "image": "image1",
            "is_read": True,
            "message": "test message 1",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:17:28 PM UTC+2",
            "title": "Wishlist alert",
        }
        mock_document2 = MagicMock()
        mock_document2.to_dict.return_value = {
            "id": "document2",
            "image": "image2",
            "is_read": False,
            "message": "test message 2",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:19:30 PM UTC+2",
            "title": "Wishlist alert",
        }
        mock_document3 = MagicMock()
        mock_document3.to_dict.return_value = {
            "id": "document3",
            "image": "image3",
            "is_read": True,
            "message": "test message 3",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:18:28 PM UTC+2",
            "title": "Wishlist alert",
        }
        self.mock_db.collection("users").document(user.id).set({"device_token": "123"})
        self.mock_db.collection("users").document(user.id).collection("logs").document(
            mock_document1.to_dict()["id"]
        ).set(mock_document1.to_dict())
        self.mock_db.collection("users").document(user.id).collection("logs").document(
            mock_document2.to_dict()["id"]
        ).set(mock_document2.to_dict())
        self.mock_db.collection("users").document(user.id).collection("logs").document(
            mock_document3.to_dict()["id"]
        ).set(mock_document3.to_dict())

    def tearDown(self):
        patch.stopall()

    def test_get_success_load_more(self):
        self._test_get_success("document2", False)

    def test_get_success_initial(self):
        self._test_get_success(value=True)

    def test_get_success_empty_list(self):
        self._test_empty_success()

    def test_get_fail(self):
        self._test_get_failure()

    def _test_get_success(self, id=None, value=None):
        if id:
            request = self.api_client.post(
                "/api/notification/get/", {"notification_id": id}
            )
        else:
            request = self.api_client.post("/api/notification/get/", {})
        response = get(request, 2)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["has_next"], value)

    def _test_empty_success(self):
        logs_ref = (
            self.mock_db.collection("users")
            .document(self.consumer.id)
            .collection("logs")
        )
        docs = logs_ref.stream()
        for doc in docs:
            doc.reference.delete()

        request = self.api_client.post("/api/notification/get/", {})
        response = get(request, 2)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["has_next"], False)
        self.assertEqual(len(response.data["notifications"]), 0)

    @patch("notification.views.db.collection", side_effect=Exception("Test exception"))
    def _test_get_failure(self, id=None):
        # Mock db.collection().document().collection().order_by().limit().stream to raise an exception

        request = self.api_client.post(
            "/api/notification/get/", {"notification_id": "123"}
        )
        response = get(request)

        self.assertEqual(response.status_code, 400)


from django.core.handlers.wsgi import WSGIRequest


class TestNotificationRemainingViews(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(
            id="test1234", username="test", email="test@example.com", type="consumer"
        )
        self.mock_authenticate = patch(
            "auth.authentication.CognitoAuthentication.authenticate"
        ).start()
        self.mock_has_permission = patch(
            "auth.permissions.CognitoPermission.has_permission"
        ).start()
        self.mock_db = patch(
            "notification.views.db", new_callable=MockFirestore
        ).start()
        # Ensure authenticate returns a user and a token (None in this case)
        self.mock_authenticate.return_value = (self.consumer, None)
        self.mock_has_permission.return_value = True
        user = self.consumer
        self.api_client.user = user

        mock_document1 = MagicMock()
        mock_document1.to_dict.return_value = {
            "id": "document1",
            "image": "image1",
            "is_read": True,
            "message": "test message 1",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:17:28 PM UTC+2",
            "title": "Wishlist alert",
        }
        mock_document2 = MagicMock()
        mock_document2.to_dict.return_value = {
            "id": "document2",
            "image": "image2",
            "is_read": False,
            "message": "test message 2",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:19:30 PM UTC+2",
            "title": "Wishlist alert",
        }
        mock_document3 = MagicMock()
        mock_document3.to_dict.return_value = {
            "id": "document3",
            "image": "image3",
            "is_read": True,
            "message": "test message 3",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:18:28 PM UTC+2",
            "title": "Wishlist alert",
        }
        self.mock_db.collection("users").document(user.id).set({"device_token": "123"})
        self.mock_db.collection("users").document(user.id).collection("logs").document(
            mock_document1.to_dict()["id"]
        ).set(mock_document1.to_dict())
        self.mock_db.collection("users").document(user.id).collection("logs").document(
            mock_document2.to_dict()["id"]
        ).set(mock_document2.to_dict())
        self.mock_db.collection("users").document(user.id).collection("logs").document(
            mock_document3.to_dict()["id"]
        ).set(mock_document3.to_dict())

    def tearDown(self):
        patch.stopall()

    def test_update_device_token_success_with_user(self):
        request = self.api_client.post(
            "/api/notification/device/", {"device_token": "new_token"}
        )
        response = update_device_token(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")
        updated_document1 = (
            self.mock_db.collection("users").document(self.consumer.id).get()
        )
        self.assertEqual(updated_document1.to_dict()["device_token"], "new_token")

    def test_update_device_token_success_with_same_token(self):
        request = self.api_client.post(
            "/api/notification/device/", {"device_token": "123"}
        )
        response = update_device_token(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Device token is already up to date")

    @patch("notification.views.db.collection", side_effect=Exception("Test exception"))
    def test_update_device_token_fail(self, mock_data):
        request = self.api_client.post(
            "/api/notification/device/", {"device_token": "new_token"}
        )
        response = update_device_token(request)
        self.assertEqual(response.status_code, 400)

    def test_update_settings_success_all_false(self):
        data = {"all": False, "following": False, "general": False, "wishlist": False}
        request = self.api_client.post("/api/notification/update_settings/", data)
        response = update_settings(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")

    def test_update_settings_success_all_true(self):
        data = {"all": True, "following": True, "general": True, "wishlist": True}
        request = self.api_client.post("/api/notification/update_settings/", data)
        response = update_settings(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")

    def test_update_settings_success_empty(self):
        request = self.api_client.post("/api/notification/update_settings/", {})
        response = update_settings(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")
        updated_document1 = (
            self.mock_db.collection("users").document(self.consumer.id).get()
        )
        self.assertTrue(updated_document1.to_dict()["settings"]["general"])

    def test_update_settings_fail_invalid_field(self):
        request = self.api_client.post(
            "/api/notification/update_settings/", {"settings": {"invalid_field": True}}
        )
        response = update_settings(request)
        self.assertEqual(response.status_code, 400)

    def test_update_settings_fail_invalid_value(self):
        request = self.api_client.post(
            "/api/notification/update_settings/",
            {"settings": {"general": "invalid_value"}},
        )
        response = update_settings(request)
        self.assertEqual(response.status_code, 400)

    def test_count_unread_notifications_success(self):
        request = self.api_client.post("/api/notification/count/unread/")
        response = count_unread_notifications(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["unread_count"], 1)

    @patch("notification.views.db.collection", side_effect=Exception("Test exception"))
    def test_count_unread_notifications_fail(self, mock_collection):
        request = self.api_client.post("/api/notification/count/unread/")
        response = count_unread_notifications(request)
        self.assertEqual(response.status_code, 400)
