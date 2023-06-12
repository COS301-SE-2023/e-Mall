from django.contrib import admin

# Register your models here.
from .models import Seller


class SellerAdmin(admin.ModelAdmin):
    list_display = ["username", "business_name", "status"]


admin.site.register(Seller, SellerAdmin)
