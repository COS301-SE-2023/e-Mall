from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from product.models import Product
from decimal import Decimal, ROUND_DOWN

fake = Faker()


def generate_fake_input(select_list):
    random_input = fake.random_element(select_list)
    return random_input


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> Optional[str]:
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
        for _ in range(50):
            discount_rate = Decimal(fake.random.uniform(0, 0.99)).quantize(
                Decimal("0.00"), rounding=ROUND_DOWN
            )
            original_price = Decimal(fake.random_int(min=10, max=1000))

            discounted_price = original_price * (Decimal(1) - discount_rate)

            # Round the discounted price to two decimal places
            discounted_price = discounted_price.quantize(
                Decimal("0.00"), rounding=ROUND_DOWN
            )
            product = Product(
                img=fake.image_url(),
                name=fake.name(),
                description=fake.text(),
                brand=fake.company(),
                category=generate_fake_input(select_category),
                price=discounted_price,
                discount=original_price - discounted_price,
                discount_rate=discount_rate,
                original_price=original_price,
            )
            product.save()
        self.stdout.write(self.style.SUCCESS("Products created successfully"))
