from django.db import models
import uuid
# Create your models here.
class ca_matrix(models.Model):
    Value_CHOICES = (
        (0, '0'),
        (1, '1'),
        (2, '2'),
        (3, '3'),
    )

    product = models.CharField(default="")
    user_id = models.UUIDField(default=uuid.uuid4)
    value = models.PositiveSmallIntegerField(choices=Value_CHOICES, default=0)

    class Meta:
        unique_together = ('product', 'user_id')  # Ensure uniqueness of product and user_id combination