from django.contrib import admin
from .models import Product


class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "min_price",
        "min_price_seller_id",
        "category",
        "brand",
        "created_at",
    ]



admin.site.register(Product, ProductAdmin)
