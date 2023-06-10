from django.db import models

# Create your models here.


class ProductSeller(models.Model):
    product = models.ForeignKey("product.Product", on_delete=models.CASCADE)
    seller = models.ForeignKey("seller.Seller", on_delete=models.CASCADE)
    original_price = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    price = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    discount_rate = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    product_url = models.URLField(max_length=200, verbose_name="Product URL")
    in_stock = models.BooleanField(default=True)
