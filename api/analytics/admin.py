from django.contrib import admin

# Register your models here.

from .models import Analytics


class AnalyticsAdmin(admin.ModelAdmin):
    list_display = [
        "seller",
        "product",
        "consumer",
        "event_type",
        "event_date",
        "metadata",
    ]


admin.site.register(
    Analytics,
    AnalyticsAdmin,
)
