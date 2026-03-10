from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from ..models import Budget
from .serializers import BudgetSerializer, BudgetListSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing budgets.
    Supports CRUD operations for user budgets.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = BudgetSerializer
    
    def get_queryset(self):
        """Return budgets for the authenticated user only"""
        return Budget.objects.filter(user=self.request.user).select_related('category', 'user')
    
    def get_serializer_class(self):
        """Use lightweight serializer for list view"""
        if self.action == 'list':
            return BudgetListSerializer
        return BudgetSerializer
    
    def perform_create(self, serializer):
        """Automatically set the user when creating a budget"""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Ensure user ownership on update"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get budget summary for the authenticated user"""
        budgets = self.get_queryset()
        
        total_budget = budgets.aggregate(total=Sum('amount'))['total'] or 0
        
        summary_data = {
            'total_budget': total_budget,
            'budget_count': budgets.count(),
            'by_period': {}
        }
        
        # Group by period
        for period in ['weekly', 'monthly', 'yearly']:
            period_budgets = budgets.filter(period=period)
            summary_data['by_period'][period] = {
                'count': period_budgets.count(),
                'total': period_budgets.aggregate(total=Sum('amount'))['total'] or 0
            }
        
        return Response(summary_data)
