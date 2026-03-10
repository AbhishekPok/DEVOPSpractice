from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings


def create_default_categories(user):
    """Create default categories for a new user"""
    from .models import Category
    
    default_categories = [
        # Income categories
        {'name': 'Salary', 'icon': '💰', 'type': 'income'},
        {'name': 'Freelance', 'icon': '💼', 'type': 'income'},
        {'name': 'Investment', 'icon': '📈', 'type': 'income'},
        {'name': 'Other Income', 'icon': '💵', 'type': 'income'},
        
        # Expense categories
        {'name': 'Food & Dining', 'icon': '🍔', 'type': 'expense'},
        {'name': 'Transportation', 'icon': '🚗', 'type': 'expense'},
        {'name': 'Shopping', 'icon': '🛍️', 'type': 'expense'},
        {'name': 'Utilities', 'icon': '💡', 'type': 'expense'},
        {'name': 'Entertainment', 'icon': '🎬', 'type': 'expense'},
        {'name': 'Healthcare', 'icon': '⚕️', 'type': 'expense'},
        {'name': 'Education', 'icon': '🎓', 'type': 'expense'},
        {'name': 'Housing', 'icon': '🏠', 'type': 'expense'},
        {'name': 'Personal Care', 'icon': '💅', 'type': 'expense'},
        {'name': 'Travel', 'icon': '✈️', 'type': 'expense'},
        {'name': 'Fitness', 'icon': '🏋️', 'type': 'expense'},
        {'name': 'Other Expense', 'icon': '📁', 'type': 'expense'},
    ]
    
    for cat_data in default_categories:
        Category.objects.get_or_create(
            user=user,
            name=cat_data['name'],
            defaults={
                'icon': cat_data['icon'],
                'type': cat_data['type']
            }
        )


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_default_categories(sender, instance, created, **kwargs):
    """Signal to create default categories when a new user is created"""
    if created:
        create_default_categories(instance)
