from django.db import models

# Create your models here.
USER_TYPE_CHOICES = (
    ('SELLER', 'seller'),
    ('CONSUMER', 'consumer'),
)


class User(models.Model):
    # id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=15, unique=True)
    email = models.EmailField(max_length=30, unique=True)
    type = models.CharField(max_length=8, choices=USER_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)

    class Meta:
        abstract = True
