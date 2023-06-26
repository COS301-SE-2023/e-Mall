from rest_framework.test import APITestCase
import pytest
from seller.models import Seller
from faker import Faker
fake = Faker()

select_type = [
    "Technology",
    "Fashion",
    "Food",
    "Health",
    "Sports",
    "Books",
    "Toys",
    "Home",
    "Beauty",
]


@pytest.mark.parametrize(
    "username, email,reg_no,business_name,business_type,catalogue_size,no_employees,website,feed_url,validity",
    [
        # valid with buiness_category set correctly according to no_employees
        (fake.user_name()[:15], fake.email()[:30], fake.pystr(min_chars=14, max_chars=14), fake.company()[:30], fake.random_element(
            select_type), fake.random_int(min=10, max=100), fake.random_int(min=1, max=250), fake.url()[:200], fake.url()[:200], True),
        # valid with buiness_category set correctly according to no_employees
        (fake.user_name()[:15], fake.email()[:30], fake.pystr(min_chars=14, max_chars=14), fake.company()[:30], fake.random_element(
            select_type), fake.random_int(min=10, max=100), fake.random_int(min=1, max=250), fake.url()[:200], fake.url()[:200], True),

        # invalid : username empty
        (None, fake.email()[:30], fake.pystr(min_chars=14, max_chars=14), fake.company()[:30], fake.random_element(
            select_type), fake.random_int(min=10, max=100), fake.random_int(min=1, max=250), fake.url()[:200], fake.url()[:200], False),

        # invalid: email empty
        (fake.user_name()[:15], None, fake.pystr(min_chars=14, max_chars=14), fake.company()[:30], fake.random_element(
            select_type), fake.random_int(min=10, max=100), fake.random_int(min=1, max=250), fake.url()[:200], fake.url()[:200], False),

        # invalid : reg_no not provided
        (fake.user_name()[:15], fake.email()[:30], None, fake.company()[:30], fake.random_element(
            select_type), fake.random_int(min=10, max=100), fake.random_int(min=1, max=250), fake.url()[:200], fake.url()[:200], False),

        # invalid : website empty
        (fake.user_name()[:15], fake.email()[:30], fake.pystr(min_chars=14, max_chars=14), fake.company()[:30], fake.random_element(
            select_type), fake.random_int(min=10, max=100), fake.random_int(min=1, max=250), None, fake.url()[:200], False),
    ],
)
def test_seller_instance(
    db, seller_factory, username, email, reg_no, business_name, business_type, catalogue_size, no_employees, website, feed_url, validity
):
    if validity:
        test = seller_factory(username=username, email=email, reg_no=reg_no, business_name=business_name, business_type=business_type,
                              catalogue_size=catalogue_size, no_employees=no_employees, website=website, feed_url=feed_url)
        selected = None
        if test.no_employees <= 10:
            # test.business_category = 'MICRO'
            selected = 'MICRO'
        elif test.no_employees <= 50:
            # test.business_category = 'SMALL'
            selected = 'SMALL'
        elif test.no_employees <= 250:
            # test.business_category = 'MEDIUM'
            selected = 'MEDIUM'
        # else:
            # test.business_category = None
        assert test.business_category == selected
    else:
        with pytest.raises(Exception):
            seller_factory(username=username, email=email, reg_no=reg_no, business_name=business_name, business_type=business_type,
                           catalogue_size=catalogue_size, no_employees=no_employees, website=website, feed_url=feed_url)


class TestSellerRegistration(APITestCase):
    def test_valid_seller_registration(self):
        url = '/api/seller/register/'
        data = {
            'username': fake.user_name()[:15],
            'email': fake.email()[:30],
            'type': 'seller',
            'reg_no': fake.bothify('##############'),
            'business_name': fake.company()[:30],
            'business_type': fake.random_element(select_type),
            'catalogue_size': fake.random_int(min=10, max=100),
            'no_employees': fake.random_int(min=1, max=250),
            'website': fake.url()[:200],
            'feed_url': fake.url()[:200],
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)

    def test_invalid_seller_registration(self):
        url = '/api/seller/register/'
        data = {
            'username': fake.user_name()[:15],
            'email': fake.email()[:30],
            'reg_no': fake.pystr(min_chars=15, max_chars=15),
            'business_name': fake.company()[:30],
            'business_type': fake.random_element(select_type),
            'catalogue_size': fake.random_int(min=10, max=100),
            'no_employees': fake.random_int(min=1, max=250),
            'website': '',
            'feed_url': fake.url()[:200],
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
