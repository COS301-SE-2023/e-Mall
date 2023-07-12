from django.db import models
from django.db.models import JSONField
import uuid

# Create your models here.


class Analytics(models.Model):
    seller = models.CharField(max_length=100, default="")
    product = models.CharField(max_length=100, default="")
    product_category = models.CharField(max_length=100, default="")
    consumer_id = models.UUIDField(default=uuid.uuid4, editable=False)
    event_type = models.CharField(max_length=100, default="")
    event_date = models.DateTimeField(auto_now_add=True)
    metadata = JSONField(null=True, blank=True)
