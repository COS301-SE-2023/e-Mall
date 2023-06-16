from pytest_factoryboy import register
from .factories import ConsumerFactory
from .factories import SellerFactory
from .factories import ProductFactory
from .factories import ProductSellerFactory

register(ConsumerFactory)
register(SellerFactory)
register(ProductFactory)
register(ProductSellerFactory)
