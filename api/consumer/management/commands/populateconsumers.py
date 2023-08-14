from django.utils import timezone
from consumer.models import Consumer
from faker import Faker
from django.core.management.base import BaseCommand
from typing import Any, Optional
import os
import json

fake = Faker()


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> str | None:
        json_file = "consumers.json"
        script_directory = os.path.dirname(__file__)
        file_path = os.path.join(script_directory, json_file)

        with open(file_path) as file:
            data = json.load(file)

        for key, consumer_data in data.items():
            consumer = Consumer(
                last_login=timezone.now(),
                username=fake.user_name()[:15],
                email=consumer_data["email"],
                wishlist=consumer_data["wishlist"],
                followed_sellers=consumer_data["followed_sellers"],
            )
            consumer.save()

        self.stdout.write(self.style.SUCCESS("Consumers created successfully"))
