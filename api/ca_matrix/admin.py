from django.contrib import admin

# Register your models here.
from .models import ca_matrix

class ca_matrixAdmin(admin.ModelAdmin):
    list_display = ["product", "user_id", "value"]

admin.site.register(ca_matrix, ca_matrixAdmin)