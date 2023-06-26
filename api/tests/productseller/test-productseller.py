import pytest
from faker import Faker
from django.test import TestCase
from tests.factories import ProductSellerFactory
from tests.factories import ProductFactory
from tests.factories import SellerFactory
from tests.factories import SellerFactory
from product.models import Product
from seller.models import Seller


@pytest.mark.django_db
@pytest.mark.parametrize(
    "field,value,validity",
    [
        # Valid cases
        ("original_price", 10.99, True),
        ("price", 9.99, True),
        ("discount", 1.00, True),
        ("discount_rate", 0.1, True),
        ("product_url", "http://example.com", True),
        ("in_stock", True, True),
        # Invalid cases
        ("product", None, False),
        ("seller", None, False),
        ("original_price", None, False),
        ("price", None, False),
        ("discount", None, False),
        ("discount_rate", None, False),
        ("product_url", None, False),
        ("in_stock", None, False),
    ],
)
def test_product_seller_instance(db, product_seller_factory, field, value, validity):
    if field == "product":
        product = Product()
    elif field == "seller":
        seller = Seller()
    else:
        product = ProductFactory()
        seller = SellerFactory()

    if validity:
        test = product_seller_factory(
            **{field: value, "product": product, "seller": seller}
        )
        assert getattr(test, field) == value

        # Check if the product and seller are correctly linked
        if field == "product":
            assert test.product == product
        elif field == "seller":
            assert test.seller == seller
    else:
        with pytest.raises(Exception):
            product_seller_factory(
                **{field: value, "product": product, "seller": seller}
            )
