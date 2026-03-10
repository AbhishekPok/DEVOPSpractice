from rest_framework import serializers
from ..models import Transaction, Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    """Full serializer for Transaction model"""
    category_detail = CategorySerializer(source='category', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'amount', 'date', 'merchant', 'category', 'category_detail',
            'type', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransactionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view"""
    category_detail = CategorySerializer(source='category', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'amount', 'date', 'merchant', 'category', 'category_detail',
            'type', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TransactionStatsSerializer(serializers.Serializer):
    """Serializer for transaction statistics"""
    total_income = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=10, decimal_places=2)
    balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    transaction_count = serializers.IntegerField()
    category_breakdown = serializers.DictField()
