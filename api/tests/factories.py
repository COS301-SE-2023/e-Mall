from consumer.models import Consumer
from seller.models import Seller, SELLER_CATEGORY_CHOICES, SELLER_STATUS_CHOICES
import factory
from faker import Faker
fake = Faker()


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
