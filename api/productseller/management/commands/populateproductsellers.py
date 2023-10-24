from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from api.utils import upload_to_spaces
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
        failed = 0
        for item in items:
            try:
                productseller_data = data[item]
                seller = Seller.objects.get(
                    business_name=productseller_data["seller_name"]
                )
                product = Product.objects.get(name=productseller_data["product_name"])
                # Create the ProductSeller object and assign the fields from the JSON data

                # Assuming the images are stored locally and img_array contains the paths to the images
                img_urls = []
                for img_path in productseller_data["img_array"]:
                    if img_path:  # Check if img_path is not empty
                        url = upload_to_spaces(img_path, "product_seller")
                        img_urls.append(url)

                productseller = ProductSeller(
                    product=product,
                    seller=seller,
                    original_price=productseller_data["original_price"],
                    price=productseller_data["price"],
                    discount=productseller_data["discount"],
                    discount_rate=productseller_data["discount_rate"],
                    product_url=productseller_data["product_url"],
                    in_stock=productseller_data["in_stock"],
                    img_array=img_urls,
                    product_name=product.name,
                )
                productseller.save()

            except Exception as e:
                failed += 1
                continue
        # sucess message with failed items in stdout
        self.stdout.write(self.style.SUCCESS(f"Failed: {failed}"))
