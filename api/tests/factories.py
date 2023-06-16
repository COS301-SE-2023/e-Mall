from django.db.models.signals import pre_save
from consumer.models import Consumer
from seller.models import Seller, SELLER_CATEGORY_CHOICES, SELLER_STATUS_CHOICES
from product.models import Product
from productseller.models import ProductSeller
from decimal import Decimal

import factory
from faker import Faker
import faker_commerce

fake = Faker()
fake.add_provider(faker_commerce.Provider)


class ConsumerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Consumer

    username = fake.user_name()[:15]
    email = fake.email()[:30]


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
select_category = [
    "electronics",
    "clothing",
    "home and kitchen",
    "health and beauty",
    "sports and outdoors",
    "toys and games",
    "books",
    "food and beverages",
]


class SellerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Seller

    username = fake.user_name()[:15]
    email = fake.email()[:30]
    # type = 'seller'
    reg_no = fake.pystr(min_chars=14, max_chars=14)
    business_name = fake.company()[:30]
    business_type = fake.random_element(select_type)
    catalogue_size = fake.random_int(min=10, max=100)
    no_employees = fake.random_int(min=1, max=250)
    # business_category = models.CharField(
    #     max_length=6, choices=SELLER_CATEGORY_CHOICES, blank=True, null=True)
    status = "PENDING"
    is_verified = False
    website = fake.url()[:200]
    feed_url = fake.url()[:200]


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    name = (fake.ecommerce_name(),)
    description = (fake.text(),)
    brand = (fake.company(),)
    category = (fake.ecommerce_category(),)


class ProductSellerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProductSeller

    product = factory.SubFactory(ProductFactory)
    seller = factory.SubFactory(SellerFactory)
    original_price = factory.LazyAttribute(
        lambda _: Decimal(fake.random_int(min=10, max=1000))
    )
    price = factory.LazyAttribute(lambda _: Decimal(fake.random_int(min=10, max=1000)))
    discount = factory.LazyAttribute(lambda _: Decimal(fake.random_int(min=0, max=500)))
    discount_rate = factory.LazyAttribute(
        lambda _: Decimal(fake.random.uniform(0, 0.99)).quantize(Decimal("0.00"))
    )
    product_url = factory.LazyAttribute(lambda _: fake.url())
    in_stock = fake.boolean()
    img_array = factory.LazyAttribute(
        lambda _: [fake.image_url() for _ in range(fake.random_int(min=1, max=5))]
    )
