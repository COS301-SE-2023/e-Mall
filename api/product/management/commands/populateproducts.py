from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from product.models import Product
from decimal import Decimal, ROUND_DOWN
from datetime import datetime, timedelta
import os
import json

# fake = Faker()


# def generate_fake_input(select_list):
#     random_input = fake.random_element(select_list)
#     return random_input


class Command(BaseCommand):
    #     def handle(self, *args: Any, **options: Any) -> Optional[str]:
    #         select_category = [
    #             "electronics",
    #             "clothing",
    #             "home and kitchen",
    #             "health and beauty",
    #             "sports and outdoors",
    #             "toys and games",
    #             "books",
    #             "food and beverages",
    #         ]
    #         for _ in range(20):
    #             product = Product(
    #                 name=fake.name(),
    #                 description=fake.text(),
    #                 brand=fake.company(),
    #                 category=generate_fake_input(select_category),
    #                 created_at=datetime.now() - timedelta(days=1),
    #                 updated_at=datetime.now() - timedelta(days=1),
    #             )
    #             product.save()
    #         self.stdout.write(self.style.SUCCESS("Products created successfully"))

    def handle(self, *args, **options):
        # Specify the name of your JSON file
        json_file = "products.json"
        script_directory = os.path.dirname(
            __file__
        )  # Get the directory of the current script
        file_path = os.path.join(
            script_directory, json_file
        )  # Create the absolute path to the JSON file

        with open(file_path) as file:
            data = json.load(file)

        for key, product_data in data.items():
            # Access individual product attributes
            product = Product(
                name=product_data["name"],
                description=product_data["description"],
                brand=product_data["brand"],
                category=product_data["category"],
                created_at=datetime.now() - timedelta(days=1),
                updated_at=datetime.now() - timedelta(days=1),
            )
            product.save()
        self.stdout.write(self.style.SUCCESS("Products created successfully"))
        # Perform operations with the product data (e.g., create product models)
