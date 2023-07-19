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
    type = models.CharField(max_length=6, default="seller", editable=False)
    reg_no = models.CharField(max_length=14, unique=True)
    business_name = models.CharField(max_length=30)
    business_type = models.CharField(max_length=100)
    catalogue_size = models.IntegerField(default=0)
    business_category = models.CharField(
        max_length=6, choices=SELLER_CATEGORY_CHOICES, default="NONE"
    )
    status = models.CharField(
        max_length=9, choices=SELLER_STATUS_CHOICES, default="PENDING"
    )
    is_verified = models.BooleanField(default=False)
    website = models.URLField(max_length=200, unique=True)
    feed_url = models.URLField(max_length=200, unique=True)
    no_employees = models.IntegerField(default=1)
    support_email = models.EmailField(max_length=50, unique=True, default="")
    landline_number = models.CharField(max_length=10, unique=True, default="0000000000")
    address = models.CharField(max_length=200, default="")
    city = models.CharField(max_length=20, default="")
    postal_code = models.CharField(max_length=4, default="0000")
    logo = models.URLField(max_length=200, unique=True, default="")
    instagram_link = models.URLField(max_length=200, unique=True, default="")
    facebook_link = models.URLField(max_length=200, unique=True, default="")
    twitter_link = models.URLField(max_length=200, unique=True, default="")

    class Meta:
        app_label = "seller"
