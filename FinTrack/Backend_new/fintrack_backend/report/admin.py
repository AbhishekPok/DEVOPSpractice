# reports/admin.py
from django.contrib import admin
from .models import Report, ReportSchedule


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'user',
        'report_type',
        'start_date',
        'end_date',
        'total_transactions',
        'net_amount',
        'created_at'
    ]
    list_filter = ['report_type', 'created_at', 'start_date']
    search_fields = ['title', 'user__username', 'user__email']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'title', 'report_type')
        }),
        ('Date Range', {
            'fields': ('start_date', 'end_date')
        }),
        ('Summary', {
            'fields': (
                'total_transactions',
                'total_income',
                'total_expenses',
                'net_amount'
            )
        }),
        ('Insights', {
            'fields': ('spending_ratio', 'avg_transactions_per_day')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ReportSchedule)
class ReportScheduleAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'user',
        'frequency',
        'report_type',
        'is_active',
        'email_report',
        'next_generation'
    ]
    list_filter = ['frequency', 'report_type', 'is_active', 'email_report']
    search_fields = ['name', 'user__username', 'user__email']
    readonly_fields = ['last_generated', 'created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'frequency', 'report_type')
        }),
        ('Settings', {
            'fields': ('is_active', 'email_report')
        }),
        ('Schedule', {
            'fields': ('last_generated', 'next_generation')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )