from django.test import RequestFactory, TestCase
from unittest.mock import MagicMock, patch
from rest_framework import status
from consumer.models import Consumer
from notification.utils import *
from mockfirestore import MockFirestore

class TestUpdateWishlist(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(id="test1234", username="test", email="test@example.com", type="consumer")
        self.mock_authenticate = patch("auth.authentication.CognitoAuthentication.authenticate").start()
        self.mock_has_permission = patch("auth.permissions.CognitoPermission.has_permission").start()
        self.mock_db = patch("notification.utils.db", new_callable=MockFirestore).start()
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
            "title": "Wishlist alert"
        }
        mock_document2 = MagicMock()
        mock_document2.to_dict.return_value = {
            "id": "document2",
            "image": "image2",
            "is_read": False,
            "message": "test message 2",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:19:30 PM UTC+2",
            "title": "Wishlist alert"
        }
        mock_document3 = MagicMock()
        mock_document3.to_dict.return_value = {
            "id": "document3",
            "image": "image3",
            "is_read": True,
            "message": "test message 3",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:18:28 PM UTC+2",
            "title": "Wishlist alert"
        }
        self.mock_db.collection('users').document(user.id).set({'device_token':'123'})
        self.mock_db.collection('users').document(user.id).collection('logs').document(mock_document1.to_dict()['id']).set(mock_document1.to_dict())
        self.mock_db.collection('users').document(user.id).collection('logs').document(mock_document2.to_dict()['id']).set(mock_document2.to_dict())
        self.mock_db.collection('users').document(user.id).collection('logs').document(mock_document3.to_dict()['id']).set(mock_document3.to_dict())
        

    def tearDown(self):
        patch.stopall()
        

            
    def test_update_wishlist_add(self):
         self._test_success(user_id=self.consumer.id,action='add')
        
    def test_update_wishlist_add_second(self):
         self._test_success(user_id=self.consumer.id,action='add', second_user_id='test456')
        
    def test_update_wishlist_remove(self):
         self._test_success(user_id=self.consumer.id,action='remove')
    
    def test_update_wishlist_without_argument(self):        
        response =  update_wishlist(None,'product1','add')
        self.assertEqual(response['status'], 'error')
    
    def _test_success(self, user_id='test1234' ,product_id='product1', action=None, second_user_id= None):
            response =  update_wishlist(user_id, product_id, action)
            self.assertEqual(response['status'], 'success')
            if(second_user_id is not None):
                 update_wishlist(second_user_id, product_id, action)
                
            updated_document = self.mock_db.collection('products').document(product_id).get()
            doc_data= updated_document.to_dict()
            if(action=='add'):
                self.assertIn(user_id,doc_data['wishlisted_users'])
            else:
                self.assertNotIn(user_id,doc_data['wishlisted_users'])
                
class TestSendMessageAPI(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(id="test1234", username="test", email="test@example.com", type="consumer")
        self.mock_authenticate = patch("auth.authentication.CognitoAuthentication.authenticate").start()
        self.mock_has_permission = patch("auth.permissions.CognitoPermission.has_permission").start()
        self.mock_db = patch("notification.utils.db", new_callable=MockFirestore).start()
        self.mock_authenticate.return_value = (self.consumer, None)
        self.mock_has_permission.return_value = True
        
        user = self.consumer
        self.api_client.user = user
    
    def tearDown(self):
        patch.stopall()

    def test_send_message_success_user(self):
        self._test_send_message_success('user')

    def test_send_message_success_query(self):
        self._test_send_message_success('query')

    def test_send_message_success_wishlist(self):
        self._test_send_message_success('wishlist')

    def test_send_message_success_follower(self):
        self._test_send_message_success('follower')

    def test_send_message_failure_invalid_msg_type(self):
        self._test_send_message_failure()

    def _test_send_message_success(self,msg_type='user'):
        request = {
            'target': self.consumer.id,
            'message_type': msg_type,
            'image': 'test_image',
            'message': 'test_message',
            'title': 'test_title'
        }

        response = send_message(request)
        self.assertEqual(response['status'], 'success')
        
    def _test_send_message_failure(self):
        request = self.api_client.post('/api/notification/create/', {
            'target': self.consumer.id,
            'message_type': 'invalid_msg_type',
            'image': 'test_image',
            'message': 'test_message',
            'title': 'test_title'
        })

        response = send_message(request)
        self.assertEqual(response['status'], 'error')
                
class TestUpdateFollowedlist(TestCase):
    def setUp(self):
        self.api_client = RequestFactory()
        self.consumer = Consumer(id="test1234", username="test", email="test@example.com", type="consumer")
        self.mock_authenticate = patch("auth.authentication.CognitoAuthentication.authenticate").start()
        self.mock_has_permission = patch("auth.permissions.CognitoPermission.has_permission").start()
        self.mock_db = patch("notification.utils.db", new_callable=MockFirestore).start()
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
            "title": "Wishlist alert"
        }
        mock_document2 = MagicMock()
        mock_document2.to_dict.return_value = {
            "id": "document2",
            "image": "image2",
            "is_read": False,
            "message": "test message 2",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:19:30 PM UTC+2",
            "title": "Wishlist alert"
        }
        mock_document3 = MagicMock()
        mock_document3.to_dict.return_value = {
            "id": "document3",
            "image": "image3",
            "is_read": True,
            "message": "test message 3",
            "message_type": "user",
            "timestamp": "September 10, 2023 at 4:18:28 PM UTC+2",
            "title": "Wishlist alert"
        }
        self.mock_db.collection('users').document(user.id).set({'device_token':'123'})
        self.mock_db.collection('users').document(user.id).collection('logs').document(mock_document1.to_dict()['id']).set(mock_document1.to_dict())
        self.mock_db.collection('users').document(user.id).collection('logs').document(mock_document2.to_dict()['id']).set(mock_document2.to_dict())
        self.mock_db.collection('users').document(user.id).collection('logs').document(mock_document3.to_dict()['id']).set(mock_document3.to_dict())
        

    def tearDown(self):
        patch.stopall()
        

            
    def test_update_followed_users_add(self):
         self._test_success(user_id=self.consumer.id,action='add')
        
    def test_update_followed_users_add_second(self):
         self._test_success(user_id=self.consumer.id,action='add', second_user_id='test456')
        
    def test_update_followed_users_remove(self):
         self._test_success(user_id=self.consumer.id,action='remove')
    
    def test_update_followed_users_without_argument(self):        
        response =  update_followed_users(None,'seller1','add')
        self.assertEqual(response['status'], 'error')
    
    def _test_success(self, user_id='test1234' ,seller_id='seller1', action=None, second_user_id= None):
            response =  update_followed_users(user_id, seller_id, action)
            self.assertEqual(response['status'], 'success')
            if(second_user_id is not None):
                 update_followed_users(second_user_id, seller_id, action)
                
            updated_document = self.mock_db.collection('users').document(seller_id).get()
            doc_data= updated_document.to_dict()
            if(action=='add'):
                self.assertIn(user_id,doc_data['followed_users'])
            else:
                self.assertNotIn(user_id,doc_data['followed_users'])
                
    