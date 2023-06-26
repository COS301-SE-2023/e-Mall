from rest_framework.test import APITestCase
from consumer.views import ConsumerViewSet
import pytest
from consumer.models import Consumer
from faker import Faker
from rest_framework import permissions
from auth.permissions import CognitoPermission

fake = Faker()


@pytest.mark.parametrize(
    "username, email, validity",
    [
        # valid
        (fake.user_name()[:15], fake.email()[:30], True),

        # invalid : username empty
        (None, fake.email()[:30], False),

        # invalid: email empty
        (fake.user_name()[:15], None, False),

        # invalid : username more than 15 char
        (fake.pystr(min_chars=16, max_chars=16), fake.email()[:30], False),

        # invalid : email more than 30 char
        (fake.user_name()[:15], fake.pystr(
            min_chars=19)+"@example.com", False),
    ],
)
def test_consumer_instance(
    db, consumer_factory, username, email, validity
):
    if validity:
        test = consumer_factory(username=username, email=email)
        assert test.type == 'consumer'
    else:
        with pytest.raises(Exception):
            consumer_factory(username=username, email=email)


class ConsumerViewSetTestCase(APITestCase):
    def setUp(self):
        self.view = ConsumerViewSet()

    def test_get_permissions_create_action(self):
        self.view.action = 'create'
        permission_instances = self.view.get_permissions()
        self.assertEqual(len(permission_instances), 1)
        self.assertIsInstance(permission_instances[0], permissions.AllowAny)

    def test_get_permissions_non_create_action(self):
        self.view.action = 'list'
        permission_instances = self.view.get_permissions()
        self.assertEqual(len(permission_instances), 1)
        self.assertIsInstance(permission_instances[0], CognitoPermission)
