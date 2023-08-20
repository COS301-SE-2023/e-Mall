from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from productseller.models import ProductSeller
from product.models import Product
from seller.models import Seller
from decimal import Decimal, ROUND_DOWN
import os
import json

fake = Faker()


def generate_fake_input(select_list):
    random_input = fake.random_element(select_list)
    return random_input


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> Optional[str]:
        json_file = "productsellers.json"
        script_directory = os.path.dirname(
            __file__
        )  # Get the directory of the current script
        file_path = os.path.join(
            script_directory, json_file
        )  # Create the absolute path to the JSON file

        with open(file_path) as file:
            data = json.load(file)

        items = list(data.keys())
        for item in items:
                productseller_data = data[item]
                seller = Seller.objects.get(business_name=productseller_data["seller_name"])
                product = Product.objects.get(name=productseller_data["product_name"]) 
                # Create the ProductSeller object and assign the fields from the JSON data
                productseller = ProductSeller(
                    product=product,
                    seller=seller,
                    original_price=productseller_data["original_price"],
                    price=productseller_data["price"],
                    discount=productseller_data["discount"],
                    discount_rate=productseller_data["discount_rate"],
                    product_url=productseller_data["product_url"],
                    in_stock=productseller_data["in_stock"],
                    img_array=productseller_data["img_array"],
                    product_name=product.name,
                )
                productseller.save()
        self.stdout.write(self.style.SUCCESS("Productsellers populated"))
