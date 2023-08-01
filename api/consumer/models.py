from django.db import models

from user.models import User

# Create your models here.


def get_default_data():
    return {"data": ""}


class Consumer(User):
    type = models.CharField(max_length=8, default="consumer", editable=False)
    # Define the JSONField for wishlist as an array of product IDs
    wishlist = models.JSONField(encoder=None, default=list, null=True, blank=True)

    # Define the JSONField for followed_sellers as an array of seller IDs
    followed_sellers = models.JSONField(
        encoder=None, default=list, null=True, blank=True
    )

    class Meta:
        app_label = "consumer"
