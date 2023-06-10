from django.core.management.base import BaseCommand
from seller.models import Seller


class Command(BaseCommand):
    help = "Depopulate sellers"

    def handle(self, *args, **options):
        Seller.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("Sellers depopulated successfully."))
