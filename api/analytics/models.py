from django.db import models
from django.db.models import JSONField
# Create your models here.


class Analytics(models.Model):
    seller = models.CharField(default="")
    product = models.CharField(default="")
    product_category = models.CharField(max_length=100, default="")
    consumer_email = models.CharField(max_length=100, default="")
    event_type = models.CharField(max_length=100, default="")
    event_date = models.DateTimeField(editable=True)
    metadata = JSONField(null=True, blank=True)
