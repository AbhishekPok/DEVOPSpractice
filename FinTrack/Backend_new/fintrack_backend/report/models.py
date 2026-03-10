# reports/models.py
from django.db import models
from django.conf import settings


class Report(models.Model):
    """Model to store generated reports for caching and history"""
    REPORT_TYPES = [
        ('all', 'All Transactions'),
        ('income', 'Income Only'),
        ('expense', 'Expenses Only'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports'
    )

    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=10, choices=REPORT_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()

    # Summary data (stored for quick access)
    total_transactions = models.IntegerField(default=0)
    total_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_expenses = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Insights
    spending_ratio = models.FloatField(default=0)
    avg_transactions_per_day = models.FloatField(default=0)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['user', 'start_date', 'end_date']),
        ]

    def __str__(self):
        return f"{self.title} - {self.user.username}"


class ReportSchedule(models.Model):
    """Model for scheduling automated reports"""
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='report_schedules'
    )
    name = models.CharField(max_length=255)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    report_type = models.CharField(max_length=10, choices=Report.REPORT_TYPES)
    is_active = models.BooleanField(default=True)
    email_report = models.BooleanField(default=False)

    last_generated = models.DateTimeField(null=True, blank=True)
    next_generation = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.get_frequency_display()}"