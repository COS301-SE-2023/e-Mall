from django.core.management.base import BaseCommand
from consumer.models import Consumer


class Command(BaseCommand):
    help = "Depopulate products"

    def handle(self, *args, **options):
        Consumer.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("Consumers depopulated successfully."))
