from django.db import models
import uuid

# Create your models here.
USER_TYPE_CHOICES = (
    ("SELLER", "seller"),
    ("CONSUMER", "consumer"),
)


class User(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False)
    username = models.CharField(
        max_length=40, unique=True,)
    email = models.EmailField(
        max_length=30, unique=True)
    type = models.CharField(
        max_length=8, choices=USER_TYPE_CHOICES, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    modified_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)

    class Meta:
        abstract = True
