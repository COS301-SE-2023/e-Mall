from django.utils import timezone
from django.db import models
from django.utils import timezone


# Create your models here.
class Query(models.Model):
    # possible customer query options
    query_options = [
        ("price", "Price"),
        ("url", "URL"),
        ("image", "Image"),
        ("in_stock", "In Stock"),
        ("info", "Info"),
    ]
    status_options = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
    ]
    id = models.AutoField(primary_key=True)
    product_id = models.PositiveIntegerField()
    user_email = models.EmailField()
    seller_email = models.EmailField()
    query_option = models.CharField(max_length=100, choices=query_options)
    event_date = models.DateTimeField(default=timezone.now(), editable=True)
    status = models.CharField(max_length=100, choices=status_options, default="pending")
