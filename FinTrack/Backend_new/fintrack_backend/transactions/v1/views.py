from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Q
from decimal import Decimal
from ..models import Transaction
from .serializers import (
    TransactionSerializer,
    TransactionListSerializer,
    TransactionStatsSerializer
)
from .filters import TransactionFilter


class TransactionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing transactions.
    Supports CRUD operations, filtering, searching, and ordering.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TransactionFilter
    search_fields = ['merchant', 'category__name', 'notes']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date', '-created_at']

    def get_queryset(self):
        """Return transactions for the authenticated user only"""
        return Transaction.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Use lightweight serializer for list view"""
        if self.action == 'list':
            return TransactionListSerializer
        return TransactionSerializer

    def perform_create(self, serializer):
        """Automatically set the user when creating a transaction"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Ensure user ownership on update"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get transaction statistics for the authenticated user.
        Optional query params: start_date, end_date
        """
        queryset = self.get_queryset()

        # Apply date filters if provided
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        # Calculate totals
        income_total = queryset.filter(type='income').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')

        expense_total = queryset.filter(type='expense').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')

        # Category breakdown
        category_breakdown = {}
        for transaction_type in ['income', 'expense']:
            categories = queryset.filter(type=transaction_type).values('category').annotate(
                total=Sum('amount'),
                count=Count('id')
            )
            category_breakdown[transaction_type] = {
                cat['category']: {
                    'total': float(cat['total']),
                    'count': cat['count']
                }
                for cat in categories
            }

        stats_data = {
            'total_income': income_total,
            'total_expenses': expense_total,
            'balance': income_total - expense_total,
            'transaction_count': queryset.count(),
            'category_breakdown': category_breakdown
        }

        serializer = TransactionStatsSerializer(stats_data)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def bulk_delete(self, request):
        """
        Bulk delete transactions by IDs.
        Expected payload: {"ids": [1, 2, 3]}
        """
        ids = request.data.get('ids', [])

        if not ids:
            return Response(
                {'error': 'No transaction IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        deleted_count = self.get_queryset().filter(id__in=ids).delete()[0]

        return Response(
            {'message': f'{deleted_count} transactions deleted successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get list of available categories for the user"""
        from ..models import Category
        from .serializers import CategorySerializer
        
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent transactions (last 10)"""
        recent_transactions = self.get_queryset()[:10]
        serializer = self.get_serializer(recent_transactions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trends(self, request):
        """
        Get daily spending trends.
        """
        from django.db.models.functions import TruncDate

        queryset = self.get_queryset()
        
        # Default to last 30 days if no date range provided
        from django.utils import timezone
        start_date = request.query_params.get('start_date')
        if not start_date:
            start_date = (timezone.now() - timezone.timedelta(days=30)).date()
        
        queryset = queryset.filter(date__gte=start_date)
        
        end_date = request.query_params.get('end_date')
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        trends = queryset.annotate(
            date_only=TruncDate('date')
        ).values('date_only').annotate(
            income=Sum('amount', filter=Q(type='income')),
            expense=Sum('amount', filter=Q(type='expense'))
        ).order_by('date_only')

        # Format for frontend
        data = []
        for entry in trends:
            data.append({
                'date': entry['date_only'],
                'income': entry['income'] or 0,
                'expense': entry['expense'] or 0
            })

        return Response(data)