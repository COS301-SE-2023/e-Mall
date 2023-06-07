from django.db import models
from seller.models import Seller


class Product(models.Model):
    id = models.AutoField(primary_key=True)
    img = models.URLField(max_length=200, verbose_name="Image URL")
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=7, decimal_places=2, default=000.00)
    discount = models.DecimalField(max_digits=7, decimal_places=2, default=000.00)
    discount_rate = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # sellers = models.ManyToManyField(Seller, through="ProductSeller")

    @property
    def PriceWithCurrency(self):
        return f"R {self.price}"
