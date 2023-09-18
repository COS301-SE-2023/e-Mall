from django.db import models


# Create your models here.
class Query(models.Model):
    # possible customer query options
    query_options = [
        ("price", "Price"),
        ("url", "URL"),
        ("image", "Image"),
        ("in_stock", "In Stock"),
        ("info", "Info"),
    ]
    id = models.AutoField(primary_key=True)
    product_id = models.PositiveIntegerField()
    user_email = models.EmailField()
    seller_email = models.EmailField()
    query_option = models.CharField(max_length=100, choices=query_options)
