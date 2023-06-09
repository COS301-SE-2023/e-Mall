from django.db import models
from seller.models import Seller


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("electronics", "Electronics"),
        ("clothing", "Clothing"),
        ("home and kitchen", "Home and Kitchen"),
        ("health and beauty", "Health and Beauty"),
        ("sports and outdoors", "Sports and Outdoors"),
        ("toys and games", "Toys and Games"),
        ("books", "Books"),
        ("food and beverages", "Food and Beverages"),
    ]

    id = models.AutoField(primary_key=True)
    img = models.URLField(max_length=200, verbose_name="Image URL")
    name = models.CharField(max_length=100)
    description = models.TextField()
    brand = models.CharField(max_length=100, default="")
    category = models.CharField(
        max_length=100, choices=CATEGORY_CHOICES, default="electronics"
    )
    original_price = models.DecimalField(max_digits=7, decimal_places=2, default=000.00)
    price = models.DecimalField(max_digits=7, decimal_places=2, default=000.00)
    discount = models.DecimalField(max_digits=7, decimal_places=2, default=000.00)
    discount_rate = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # sellers = models.ManyToManyField(Seller, through="ProductSeller")

    @property
    def PriceWithCurrency(self):
        return f"R {self.price}"
