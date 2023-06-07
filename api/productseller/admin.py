from django.contrib import admin

# Register your models here.
from .models import ProductSeller

class ProductSellerAdmin(admin.ModelAdmin):
    list_display = ('product', 'seller', 'price')
    list_filter = ('product', 'seller')
    search_fields = ('product__name', 'seller__name')

admin.site.register(ProductSeller, ProductSellerAdmin)
