from django.db import models

# Create your models here.
USER_TYPE_CHOICES = (
    ('SELLER', 'seller'),
    ('USER', 'user'),
)


class Users(models.Model):
    # id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=15, unique=True)
    email = models.EmailField(max_length=30, unique=True)
    type = models.CharField(max_length=6, choices=USER_TYPE_CHOICES)
