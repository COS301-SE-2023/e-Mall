from django.db import models
import uuid

# Create your models here.


class ProductSeller(models.Model):
    product = models.ForeignKey("product.Product", on_delete=models.CASCADE)
    seller = models.ForeignKey("seller.Seller", on_delete=models.CASCADE)
    original_price = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    price = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    discount_rate = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)
    product_url = models.URLField(max_length=1000, verbose_name="Product URL")
    in_stock = models.BooleanField(default=True)
    img_array = models.JSONField(max_length=1000, default=list)
    business_name = models.CharField(max_length=100, default="")
    product_name = models.CharField(default="")
    product_category = models.CharField(default="")

    def get_names(self):
        seller = self.seller
        product = self.product
        if seller is not None and product is not None:
            business_name = seller.business_name
            product_category = product.category
            return business_name, product_category

        return None

    @property
    def business_name(self):
        return self.get_names()[0] if self.get_names() else None

    @property
    def product_category(self):
        return self.get_names()[1] if self.get_names() else None
