import uuid
from django.contrib.postgres.fields import ArrayField
from django.db import models
from productseller.models import ProductSeller


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("electronics", "Electronics"),
        ("clothing", "Clothing"),
        ("home and kitchen", "Home and Kitchen"),
        ("health and beauty", "Health and Beauty"),
        ("sports and outdoors", "Sports and Outdoors"),
        ("toys and games", "Toys and Games"),
        ("books", "Books"),
    ]

    id = models.AutoField(primary_key=True)
    min_price_img_array = ArrayField(models.CharField(), verbose_name="Image URL")
    name = models.CharField(max_length=100)
    description = models.TextField()
    brand = models.CharField(max_length=100, default="")
    category = models.CharField(
        max_length=100, choices=CATEGORY_CHOICES, default="electronics"
    )
    min_price = models.DecimalField(max_digits=7, decimal_places=2, default=000.00)
    min_price_seller_id = models.UUIDField(default=uuid.uuid4, editable=False)
    min_price_seller_product_url = models.URLField(verbose_name="Seller URL")
    min_price_seller_business_name = models.CharField(max_length=100, default="")
    min_price_in_stock = models.BooleanField(default=True)
    min_price_discount = models.BooleanField(default=False)
    min_price_discount_rate = models.DecimalField(max_digits=3, decimal_places=2)
    min_price_original_price = models.DecimalField(max_digits=7, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_minimum_price(self):
        productsellers = self.productseller_set.all()
        if productsellers.exists():
            min_price = productsellers.aggregate(models.Min("price"))["price__min"]
            productseller = productsellers.filter(price=min_price).first()
            return (
                min_price,
                productseller.seller_id,
                productseller.product_url,
                productseller.seller.business_name,
                productseller.in_stock,
                productseller.discount,
                productseller.discount_rate,
                productseller.original_price,
                productseller.img_array,
            )
        return None, None, None, None, None, None, None, None, None

    def min_price(self):
        min_price, _, _, _, _, _, _, _, _ = self.get_minimum_price()
        return min_price

    def min_price_seller_id(self):
        _, seller_id, _, _, _, _, _, _, _ = self.get_minimum_price()
        return seller_id

    def min_price_seller_product_url(self):
        _, _, seller_url, _, _, _, _, _, _ = self.get_minimum_price()
        return seller_url

    def min_price_seller_business_name(self):
        _, _, _, business_name, _, _, _, _, _ = self.get_minimum_price()
        return business_name

    def min_price_in_stock(self):
        _, _, _, _, in_stock, _, _, _, _ = self.get_minimum_price()
        return in_stock

    def min_price_discount(self):
        _, _, _, _, _, discount, _, _, _ = self.get_minimum_price()
        return discount

    def min_price_discount_rate(self):
        _, _, _, _, _, _, discount_rate, _, _ = self.get_minimum_price()
        return discount_rate

    def min_price_original_price(self):
        _, _, _, _, _, _, _, original_price, _ = self.get_minimum_price()
        return original_price

    def min_price_img_array(self):
        _, _, _, _, _, _, _, _, img_array = self.get_minimum_price()
        return img_array

    min_price.short_description = "Minimum Price"
    min_price_seller_id.short_description = "Seller ID"
    min_price_seller_product_url.short_description = "Seller Product URL"
    min_price_seller_business_name.short_description = "Seller Business Name"
    min_price_in_stock.short_description = "In Stock"
    min_price_discount.short_description = "Discount"
    min_price_discount_rate.short_description = "Discount Rate"
    min_price_original_price.short_description = "Original Price"

    class Meta:
        verbose_name_plural = "Products"

    def __str__(self):
        return self.name
