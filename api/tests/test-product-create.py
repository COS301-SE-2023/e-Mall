from rest_framework.test import APITestCase
import pytest
from seller.models import Seller
from faker import Faker
import faker_commerce
fake = Faker()
fake.add_provider(faker_commerce.Provider)

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
    "field,value,validity",
    [
        # valid
        ("name", fake.ecommerce_name(), True),
        # invalid name
        ("name", None, False),
        # invalid description
        ("dscription", None, False),
    ],
)
def test_product_instance(
    db, product_factory, field, value, validity
):
    if validity:
        test = product_factory(**{field: value})
        assert getattr(test, field) == value
    else:
        with pytest.raises(Exception):
            product_factory(**{field: value})
