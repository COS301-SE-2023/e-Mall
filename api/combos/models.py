from django.db import models
from django.contrib.postgres.fields import ArrayField

class Combos(models.Model):
    id = models.AutoField(primary_key=True)
    combo_name = models.CharField(max_length=100)
    user_emails = ArrayField(models.EmailField())
    product_ids = ArrayField(models.PositiveIntegerField())
    pending_emails = ArrayField(models.EmailField())

    def __str__(self):
        return self.combo_name
