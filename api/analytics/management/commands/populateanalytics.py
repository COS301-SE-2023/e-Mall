from typing import Any, Optional
from django.core.management.base import BaseCommand
from faker import Faker
from analytics.models import Analytics
from decimal import Decimal, ROUND_DOWN
from datetime import datetime, timedelta
import os
import json


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any):
        json_file = "analytics.json"
        script_directory = os.path.dirname(__file__)
        file_path = os.path.join(script_directory, json_file)
        with open(file_path) as file:
            data = json.load(file)

        for key, analytics_data in data.items():
            analytics = Analytics(
                seller=analytics_data["seller"],
                product=analytics_data["product"],
                product_category=analytics_data["product_category"],
                consumer_email=analytics_data["consumer_email"],
                event_type=analytics_data["event_type"],
                event_date=analytics_data["event_date"],
            )
            analytics.save()
        self.stdout.write(self.style.SUCCESS("Analytics created successfully"))
