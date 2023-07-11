from django.db import models
from django.postgres.fields import JSONField

# Create your models here.

class Analytics(models.Model):
    productseller = models.ForeignKey("productseller.ProductSeller", on_delete=models.CASCADE)
    customer = models.ForeignKey("customer.Customer", on_delete=models.CASCADE)
    event_type = models.CharField(max_length=100, default="")
    event_date = models.DateTimeField(auto_now_add=True)
    metadata = JSONField(null = True, blank = True)