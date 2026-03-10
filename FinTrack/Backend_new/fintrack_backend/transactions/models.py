from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal


class Category(models.Model):
    """Custom category model for transactions"""
    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, default='📁')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='expense')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']
        unique_together = [('user', 'name')]
        indexes = [
            models.Index(fields=['user', 'type'], name='transaction_user_id_f7f68b_idx'),
        ]
    
    def __str__(self):
        return f"{self.icon} {self.name} ({self.type})"


class Transaction(models.Model):
    """Transaction model for tracking income and expenses"""
    TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    date = models.DateField()
    merchant = models.CharField(max_length=255)
    category = models.ForeignKey(
        'Category',
        on_delete=models.RESTRICT,
        related_name='transactions',
        null=True,
        blank=True
    )
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'date'], name='transaction_user_id_8af7f1_idx'),
            models.Index(fields=['user', 'category'], name='transaction_user_id_cb8cb9_idx'),
            models.Index(fields=['user', 'type'], name='transaction_user_id_4685bf_idx'),
        ]
    
    def __str__(self):
        return f"{self.merchant} - {self.amount} ({self.type}) on {self.date}"
