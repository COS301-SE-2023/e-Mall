import pytest

from pytest_factoryboy import register
from .factories import ConsumerFactory
from .factories import SellerFactory

register(ConsumerFactory)
register(SellerFactory)
