from django.db import models
from product.models import Product
from seller.models import Seller


class ProductSeller(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=7, decimal_places=2)
