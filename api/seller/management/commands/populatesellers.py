from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from seller.models import Seller
from django.utils import timezone
import random
import os
import json

fake = Faker()


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> Optional[str]:
        # select_category = [
        #     "MICRO",
        #     "SMALL",
        #     "MEDIUM",
        # ]
        # select_type = [
        #     "Technology",
        #     "Fashion",
        #     "Food",
        #     "Health",
        #     "Sports",
        #     "Books",
        #     "Toys",
        #     "Home",
        #     "Beauty",
        # ]
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
                username=seller_data["username"],
                email=seller_data["email"],
                created_at=timezone.now(),
                modified_at=timezone.now(),
                last_login=timezone.now(),
                type="seller",
                reg_no=random.randint(10**13, (10**14) - 1),
                business_name=seller_data["business_name"],
                business_type=seller_data["business_type"],
                catalogue_size=fake.random_int(min=10, max=100),
                no_employees=fake.random_int(min=1, max=250),
                status="ACTIVE",
                is_verified=True,
                website=seller_data["website"],
                feed_url=fake.url(),
                landline_number=seller_data["landline_number"],
                support_email=seller_data["support_email"],
                address=seller_data["address"],
                city=seller_data["city"],
                postal_code=seller_data["postal_code"],
                logo=seller_data["logo"],
                instagram_link=seller_data["instagram_link"],
                facebook_link=seller_data["facebook_link"],
                twitter_link=seller_data["twitter_link"],
            )
            seller.save()
        self.stdout.write(self.style.SUCCESS("Sellers created successfully"))
        # Perform operations with the product data (e.g., create product models)
