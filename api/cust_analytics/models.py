from django.db import models
import uuid
# Create your models here.

class cust_analytics(models.Model):
    Value_CHOICES = (
        (0, '0'),
        (1, '1'),
        (2, '2'),
        (3, '3'),
    )

    product = models.CharField(default="")
    user_email = models.CharField(default="")
    value = models.PositiveSmallIntegerField(choices=Value_CHOICES, default=0)

    class Meta:
        unique_together = ('product', 'user_email')  # Ensure uniqueness of product and user_email combination