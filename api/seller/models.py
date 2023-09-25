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
    website = models.URLField(
        max_length=200,
    )
    feed_url = models.URLField(
        max_length=200,
    )
    no_employees = models.IntegerField(default=1)
    support_email = models.EmailField(max_length=50, default="  ", null=True)
    landline_number = models.CharField(max_length=10, default="0000000000", null=True)
    address = models.CharField(max_length=200, default="  ", null=True)
    city = models.CharField(max_length=20, default="  ", null=True)
    postal_code = models.CharField(max_length=4, default="0000", null=True)
    logo = models.URLField(max_length=1000, default="  ", null=True)
    instagram_link = models.URLField(max_length=200, default="  ", null=True)
    facebook_link = models.URLField(max_length=200, default="  ", null=True)
    twitter_link = models.URLField(max_length=200, default="  ", null=True)

    class Meta:
        app_label = "seller"
