from pytest_factoryboy import register
from .factories import ConsumerFactory
from .factories import SellerFactory
from .factories import ProductFactory

register(ConsumerFactory)
register(SellerFactory)
register(ProductFactory)
