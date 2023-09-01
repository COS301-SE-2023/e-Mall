from django.contrib import admin
from .models import Combos
# Register your models here.

class CombosAdmin(admin.ModelAdmin):
    list_display = ('id','combo_name', 'user_emails', 'product_ids')
admin.site.register(Combos, CombosAdmin)