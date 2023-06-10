from django.core.management.base import BaseCommand
from product.models import Product


class Command(BaseCommand):
    help = "Depopulate products"

    def handle(self, *args, **options):
        Product.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("Products depopulated successfully."))
