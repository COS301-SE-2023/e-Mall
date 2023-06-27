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
        last_product_id = Product.objects.last().id
        current_product_id = last_product_id - 28
        seller_uuids = Seller.objects.values_list("id", flat=True)

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
        x = 0
        i = 0
        for current_product_id in range(int(current_product_id), last_product_id + 1):
            product = Product.objects.get(id=current_product_id)
            # Iterate over items in batches of three
            batch_keys = items[i: i + 3]  # Get the keys for the current batch
            i += 3
            if len(batch_keys) < 3:
                break  # Break the loop if less than three JSON objects are processed

            for key in batch_keys:
                productseller_data = data[key]
                seller_uuid = seller_uuids[x]
                x += 1
                uuid_str = str(seller_uuid)
                seller = Seller.objects.get(id=uuid_str)
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
                if x >= len(seller_uuids):
                    x = 0  # Reset counter if we reach the end of seller_uuids
        self.stdout.write(self.style.SUCCESS("Productsellers populated"))
