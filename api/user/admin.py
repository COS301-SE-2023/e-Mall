from django.contrib import admin

# Register your models here.
from .models import User


class UserAdmin(admin.ModelAdmin):
    readonly_fields = ("created_at", "modified_at", "type")


admin.site.register(User)
