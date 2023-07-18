from django.core.management.base import BaseCommand
from analytics.models import Analytics

class Command(BaseCommand):
    help = "Depopulate analytics"

    def handle(self, *args, **options):
        Analytics.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("Analytics depopulated successfully."))