from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from productseller.models import ProductSeller
from product.models import Product
from seller.models import Seller
from decimal import Decimal, ROUND_DOWN

fake = Faker()


def generate_fake_input(select_list):
    random_input = fake.random_element(select_list)
    return random_input


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> Optional[str]:
        for _ in range(20):
            discount_rate = Decimal(fake.random.uniform(0, 0.99)).quantize(
                Decimal("0.00"), rounding=ROUND_DOWN
            )
            original_price = Decimal(fake.random_int(min=10, max=1000))

            discounted_price = original_price * (Decimal(1) - discount_rate)

            # Round the discounted price to two decimal places
            discounted_price = discounted_price.quantize(
                Decimal("0.00"), rounding=ROUND_DOWN
            )
            productseller = ProductSeller(
                product=generate_fake_input(Product.objects.all()),
                seller=generate_fake_input(Seller.objects.all()),
                price=discounted_price,
                discount=original_price - discounted_price,
                discount_rate=discount_rate,
                original_price=original_price,
                product_url=fake.url(),
                in_stock=fake.boolean(),
                img_array=[fake.image_url() for _ in range(3)],
            )
            productseller.save()
        self.stdout.write(self.style.SUCCESS("Productseller's created successfully"))
