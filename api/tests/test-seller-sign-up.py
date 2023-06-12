# # import pytest
# # from django.urls import reverse
# # from rest_framework.settings import api_settings
# # from rest_framework import status
# # from rest_framework.test import APITestCase
# # from seller.models import Seller


# # class SellerSignUpTestCase(APITestCase):
# #     def test_get_sellers(self):
# #         """
# #             Ensure we can create a new account object.
# #             """
# #         url = reverse('seller-list')
# #         response = self.client.get(url, format='json')
# #         self.assertEqual(response.status_code, status.HTTP_200_OK)

# #     def test_seller_signup_all_correct_details(self):
# #         """
# #             Ensure we can create a new account object.
# #             """
# #         url = reverse('seller-list')
# #         data = {'username': 'test',
# #                 'email': 'test@example.com',
# #                 'type': 'seller',
# #                 'reg_no': '1234567890',
# #                 'business_name': 'Test Business',
# #                 'business_type': 'Test Type',
# #                 'catalogue_size': 200,
# #                 'business_category': 'MICRO',
# #                 'status': 'PENDING',
# #                 'is_verified': False,
# #                 'website': 'https://www.bing.com/',
# #                 'feed_url': 'https://www.bing.com/', }
# #         response = self.client.post(url, data, format='json')
# #         print(response.content)
# #         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
# #         self.assertEqual(Seller.objects.count(), 1)
# #         self.assertEqual(Seller.objects.get().username, 'test')

# #     def test_seller_signup_incorrect_details(self):
# #         """
# #             Ensure we can create a new account object.
# #             """
# #         url = reverse('seller-list')
# #         data = {'username': 'test',
# #                 'email': 'test',
# #                 'type': 'seller',
# #                 'reg_no': '1234567890',
# #                 'business_name': 'Test Business',
# #                 'business_type': 'Test Type',
# #                 'catalogue_size': 200,
# #                 'business_category': 'MICRO',
# #                 'status': 'PENDING',
# #                 'is_verified': False,
# #                 'website': 'https://www.google.com/',
# #                 'feed_url': 'https://www.google.com/', }
# #         response = self.client.post(url, data, format='json')
# #         print(response.content)
# #         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
# #         self.assertEqual(Seller.objects.count(), 0)
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
        # valid
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

        #     # invalid : email more than 30 char
        #     (fake.user_name()[:15], fake.pystr(
        #         min_chars=19)+"@example.com", False),
    ],
)
def test_seller_instance(
    db, seller_factory, username, email, reg_no, business_name, business_type, catalogue_size, no_employees, website, feed_url, validity
):
    if validity:
        seller_factory(username=username, email=email, reg_no=reg_no, business_name=business_name, business_type=business_type,
                       catalogue_size=catalogue_size, no_employees=no_employees, website=website, feed_url=feed_url)
    else:
        with pytest.raises(Exception):
            seller_factory(username=username, email=email, reg_no=reg_no, business_name=business_name, business_type=business_type,
                           catalogue_size=catalogue_size, no_employees=no_employees, website=website, feed_url=feed_url)
