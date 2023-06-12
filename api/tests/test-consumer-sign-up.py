import pytest
from consumer.models import Consumer
from faker import Faker
fake = Faker()


@pytest.mark.parametrize(
    "username, email, validity",
    [
        # valid
        (fake.user_name()[:15], fake.email()[:30], True),

        # invalid : username empty
        (None, fake.email()[:30], False),

        # invalid: email empty
        (fake.user_name()[:15], None, False),

        # invalid : username more than 15 char
        (fake.pystr(min_chars=16, max_chars=16), fake.email()[:30], False),

        # invalid : email more than 30 char
        (fake.user_name()[:15], fake.pystr(
            min_chars=19)+"@example.com", False),
    ],
)
def test_consumer_instance(
    db, consumer_factory, username, email, validity
):
    if validity:
        test = consumer_factory(username=username, email=email)
        assert test.type == 'consumer'
    else:
        with pytest.raises(Exception):
            consumer_factory(username=username, email=email)
