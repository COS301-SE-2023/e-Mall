from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from seller.models import Seller
from django.utils import timezone
import random
import os
import json

fake = Faker()


# def generate_fake_input(select_list):
#     random_input = fake.random_element(select_list)
#     return random_input




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
        # for reg_no in reg_no_list:
        #     status = generate_fake_input(["PENDING", "ACTIVE"])

        #     if status == "PENDING":
        #         is_verified = False
        #     else:
        #         is_verified = True

        #     seller = Seller(
        #         username=fake.user_name()[:15],
        #         email=fake.email()[:30],
        #         created_at=timezone.now(),
        #         modified_at=timezone.now(),
        #         last_login=timezone.now(),
        #         type="seller",
        #         reg_no=reg_no,
        #         business_name=fake.company(),
        #         business_type=generate_fake_input(select_type),
        #         catalogue_size=fake.random_int(min=10, max=100),
        #         no_employees=fake.random_int(min=1, max=250),
        #         # business_category=generate_fake_input(select_category),
        #         status=status,
        #         is_verified=is_verified,
        #         website=fake.url(),
        #         feed_url=fake.url(),
        #     )

        #     seller.save()
        # self.stdout.write(self.style.SUCCESS("Sellers created successfully"))
# Specify the name of your JSON file
        json_file = "sellers.json"
        script_directory = os.path.dirname(
            __file__
        )  # Get the directory of the current script
        file_path = os.path.join(
            script_directory, json_file
        )  # Create the absolute path to the JSON file

        with open(file_path) as file:
            data = json.load(file)

        for key, seller_data in data.items():
            # Access individual product attributes
            seller = Seller(
                username=seller_data['username'],
                email=seller_data['email'],
                created_at=timezone.now(),
                modified_at=timezone.now(),
                last_login=timezone.now(),
                type="seller",
                reg_no = random.randint(10**13, (10**14)-1),
                business_name=seller_data['business_name'],
                business_type=seller_data['business_type'],
                catalogue_size=fake.random_int(min=10, max=100),
                no_employees=fake.random_int(min=1, max=250),
                status='ACTIVE',
                is_verified=True,
                website=seller_data['website'],
                feed_url=fake.url(),
            )
            seller.save()
        self.stdout.write(self.style.SUCCESS("Sellers created successfully"))
        # Perform operations with the product data (e.g., create product models)
