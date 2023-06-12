from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from seller.models import Seller
from django.utils import timezone
import random

fake = Faker()


def generate_fake_input(select_list):
    random_input = fake.random_element(select_list)
    return random_input


reg_no_list = random.sample(range(1, 1000), 20)


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> Optional[str]:
        select_category = [
            "MICRO",
            "SMALL",
            "MEDIUM",
        ]
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
        for reg_no in reg_no_list:
            status = generate_fake_input(["PENDING", "ACTIVE"])

            if status == "PENDING":
                is_verified = False
            else:
                is_verified = True

            seller = Seller(
                username=fake.user_name()[:15],
                email=fake.email()[:30],
                created_at=timezone.now(),
                modified_at=timezone.now(),
                last_login=timezone.now(),
                type="seller",
                reg_no=reg_no,
                business_name=fake.company(),
                business_type=generate_fake_input(select_type),
                catalogue_size=fake.random_int(min=10, max=100),
                no_employees=fake.random_int(min=1, max=250),
                # business_category=generate_fake_input(select_category),
                status=status,
                is_verified=is_verified,
                website=fake.url(),
                feed_url=fake.url(),
            )

            seller.save()
        self.stdout.write(self.style.SUCCESS("Sellers created successfully"))
