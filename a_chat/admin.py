from django.contrib import admin
from .models import ZajelMessage, ZajelGroup

# Register your models here.
admin.site.register(ZajelMessage)
admin.site.register(ZajelGroup)