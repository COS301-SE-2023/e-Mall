from django.contrib import admin
from .models import Product


class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "min_price", "min_price_seller_id", "category"]


admin.site.register(Product, ProductAdmin)
