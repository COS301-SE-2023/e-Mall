from django.core.management.base import BaseCommand
from productseller.models import ProductSeller


class Command(BaseCommand):
    help = "Depopulate products"

    def handle(self, *args, **options):
        ProductSeller.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("ProductSellers depopulated successfully."))
