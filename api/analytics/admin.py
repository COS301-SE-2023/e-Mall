from django.contrib import admin

# Register your models here.

from .models import Analytics


class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ["seller", "product","consumer_email", "event_type", "event_date"]


admin.site.register(Analytics, AnalyticsAdmin)
