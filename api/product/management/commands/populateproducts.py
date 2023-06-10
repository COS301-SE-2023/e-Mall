from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from product.models import Product
from decimal import Decimal, ROUND_DOWN
from datetime import datetime, timedelta

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
        for _ in range(20):
            product = Product(
                img=fake.image_url(),
                name=fake.name(),
                description=fake.text(),
                brand=fake.company(),
                category=generate_fake_input(select_category),
                original_price=Decimal(fake.random_int(100, 10000)),
                created_at=datetime.now() - timedelta(days=1),
                updated_at=datetime.now() - timedelta(days=1),
            )
            product.save()
        self.stdout.write(self.style.SUCCESS("Products created successfully"))
