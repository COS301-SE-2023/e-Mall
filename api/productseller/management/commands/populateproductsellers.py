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
        current_product_id = last_product_id - 2
        print("last product",last_product_id)
        print("current id",current_product_id)
        seller_uuids = Seller.objects.values_list("id", flat=True)
        print(seller_uuids)

        json_file = "productsellers.json"
        script_directory = os.path.dirname(
            __file__
        )  # Get the directory of the current script
        file_path = os.path.join(
            script_directory, json_file
        )  # Create the absolute path to the JSON file

        with open(file_path) as file:
            data = json.load(file)

        for key, productseller_data in data.items():
            for current_product_id in range(int(current_product_id), last_product_id+1):
                for i in range(0,3):
                    seller_uuid = seller_uuids[i]
                    product = Product.objects.get(id=current_product_id)
                    uuid_str = str(seller_uuid)
                    seller = Seller.objects.get(id=uuid_str)
                    print(uuid_str)
                    print(product.id)
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
                    )
                    productseller.save()
                current_product_id += 1
