from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal
from transactions.models import Category


class Budget(models.Model):
    """Budget model for tracking spending limits by category"""
    PERIOD_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='budgets'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='budgets'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES, default='monthly')
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = [('user', 'category', 'start_date', 'end_date')]
        indexes = [
            models.Index(fields=['user', 'period'], name='budget_budg_user_id_6ecba7_idx'),
            models.Index(fields=['user', 'start_date', 'end_date'], name='budget_budg_user_id_e80fb0_idx'),
        ]
    
    def __str__(self):
        return f"{self.category.name} - रु{self.amount} ({self.period})"
