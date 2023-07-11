from django.db import models
from django.db.models import JSONField

# Create your models here.


class Analytics(models.Model):
    seller = models.ForeignKey("seller.Seller", on_delete=models.CASCADE)
    product = models.ForeignKey("product.Product", on_delete=models.CASCADE)
    consumer = models.ForeignKey("consumer.Consumer", on_delete=models.CASCADE)
    event_type = models.CharField(max_length=100, default="")
    event_date = models.DateTimeField(auto_now_add=True)
    metadata = JSONField(null=True, blank=True)
