from rest_framework import serializers
from django.db.models import Sum
from decimal import Decimal
from ..models import Budget
from transactions.v1.serializers import CategorySerializer
from transactions.models import Transaction


class BudgetSerializerMixin:
    """Shared spending calculation methods to avoid code duplication."""

    def _get_spent(self, obj):
        # Cache on the object to avoid duplicate DB calls within the same request
        if not hasattr(obj, '_spent_cache'):
            spent = Transaction.objects.filter(
                user=obj.user,
                category=obj.category,
                type='expense',
                date__gte=obj.start_date,
                date__lte=obj.end_date
            ).aggregate(total=Sum('amount'))['total']
            obj._spent_cache = float(spent or Decimal('0.00'))
        return obj._spent_cache

    def get_spent_amount(self, obj):
        return self._get_spent(obj)

    def get_remaining_amount(self, obj):
        remaining = float(obj.amount) - self._get_spent(obj)
        return max(0, remaining)

    def get_percentage_used(self, obj):
        budget_amount = float(obj.amount)
        if budget_amount == 0:
            return 0
        return round((self._get_spent(obj) / budget_amount) * 100, 2)


class BudgetSerializer(BudgetSerializerMixin, serializers.ModelSerializer):
    """Serializer for Budget model with spending calculations."""
    category_detail = CategorySerializer(source='category', read_only=True)
    spent_amount = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    percentage_used = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            'id', 'category', 'category_detail', 'amount', 'period',
            'start_date', 'end_date', 'spent_amount', 'remaining_amount',
            'percentage_used', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError(
                    {"end_date": "End date must be after start date."}
                )
        return data


class BudgetListSerializer(BudgetSerializerMixin, serializers.ModelSerializer):
    """Lightweight serializer for list view with spending calculations."""
    category_detail = CategorySerializer(source='category', read_only=True)
    spent_amount = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    percentage_used = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            'id', 'category', 'category_detail', 'amount', 'period',
            'start_date', 'end_date', 'spent_amount', 'remaining_amount',
            'percentage_used'
        ]
