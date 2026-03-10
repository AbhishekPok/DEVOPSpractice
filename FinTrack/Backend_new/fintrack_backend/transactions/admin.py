from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['merchant', 'amount', 'type', 'category', 'date', 'user']
    list_filter = ['type', 'category', 'date']
    search_fields = ['merchant', 'notes']
    date_hierarchy = 'date'
    ordering = ['-date']