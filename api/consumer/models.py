from django.db import models

from user.models import User

# Create your models here.


def get_default_data():
    return {"data": ""}


class Consumer(User):
    type = models.CharField(max_length=8, default="consumer", editable=False)
    # Define the JSONField for wishlist as an array of product IDs
    wishlist = models.JSONField(encoder=None, default=list, null=True, blank=True)
    #Define the JSONfield for similar products
    recommended_products = models.JSONField(encoder=None, default=list, null=True, blank=True)
    # Define the JSONField for followed_sellers as an array of seller IDs
    followed_sellers = models.JSONField(
        encoder=None, default=list, null=True, blank=True
    )
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    phone_number = models.CharField(max_length=10, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=20, default="  ", null=True)
    postal_code = models.CharField(max_length=4, default="0000", null=True)
    class Meta:
        app_label = "consumer"
