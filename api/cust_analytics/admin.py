from django.contrib import admin
from .models import cust_analytics
# Register your models here.
class cust_analyticsAdmin(admin.ModelAdmin):
    list_display = ["product", "user_email", "value"]

admin.site.register(cust_analytics, cust_analyticsAdmin)