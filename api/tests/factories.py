from consumer.models import Consumer
import factory
from faker import Faker
fake = Faker()


class ConsumerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Consumer

    username = fake.user_name()[:15]
    email = fake.email()[:30]
