from django.db import models
from user.models import User
from product.models import Product

# Create your models here.
SELLER_STATUS_CHOICES = (
    ("PENDING", "pending"),
    ("ACTIVE", "active"),
    ("SUSPENDED", "suspended"),
)
SELLER_CATEGORY_CHOICES = (
    ("MICRO", "micro"),
    ("SMALL", "small"),
    ("MEDIUM", "medium"),
)


class Seller(User):
    type = models.CharField(max_length=6, default='seller', editable=False)
    reg_no = models.CharField(max_length=14, unique=True)
    business_name = models.CharField(max_length=30)
    business_type = models.CharField(max_length=100)
    catalogue_size = models.IntegerField(default=0)
    business_category = models.CharField(max_length=6, choices=SELLER_CATEGORY_CHOICES)
    status = models.CharField(max_length=9, choices=SELLER_STATUS_CHOICES)
    is_verified = models.BooleanField(default=False)
    website = models.URLField(max_length=200, unique=True)
    feed_url = models.URLField(max_length=200, unique=True)

    class Meta:
        app_label = 'seller'
