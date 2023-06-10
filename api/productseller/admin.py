from django.contrib import admin

# Register your models here.

from .models import ProductSeller


class ProductSellerAdmin(admin.ModelAdmin):
    list_display = ["product_id", "product", "seller_id", "seller", "price"]


admin.site.register(
    ProductSeller,
    ProductSellerAdmin,
)
