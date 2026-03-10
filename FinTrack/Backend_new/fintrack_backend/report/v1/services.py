# reports/v1/services.py
from django.db.models import Sum, Count
from decimal import Decimal
from datetime import datetime

from transactions.models import Transaction


class ReportService:
    """Service class for report generation logic - Version 1"""

    @staticmethod
    def generate_report(user, start_date, end_date, report_type='all'):
        """
        Generate a comprehensive financial report

        Args:
            user: User object
            start_date: Start date string (YYYY-MM-DD)
            end_date: End date string (YYYY-MM-DD)
            report_type: 'all', 'income', or 'expense'

        Returns:
            dict: Report data with summary, insights, and transactions
        """
        # Query transactions
        queryset = Transaction.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=end_date
        )

        if report_type != 'all':
            queryset = queryset.filter(type=report_type)

        # Calculate summary
        total_income = queryset.filter(type='income').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')

        total_expenses = queryset.filter(type='expense').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')

        net_amount = total_income - total_expenses

        # Get transactions
        transactions = queryset.order_by('-date')

        # Calculate insights
        insights = ReportService._calculate_insights(
            total_income=total_income,
            total_expenses=total_expenses,
            transaction_count=len(transactions),
            start_date=start_date,
            end_date=end_date
        )

        # Build report data
        return {
            'summary': {
                'total_transactions': len(transactions),
                'total_income': float(total_income),
                'total_expenses': float(total_expenses),
                'net_amount': float(net_amount),
                'start_date': start_date,
                'end_date': end_date,
                'report_type': report_type,
            },
            'insights': insights,
            'transactions': transactions
        }

    @staticmethod
    def _calculate_insights(total_income, total_expenses, transaction_count, start_date, end_date):
        """Calculate financial insights"""
        days_diff = (datetime.strptime(end_date, '%Y-%m-%d') -
                     datetime.strptime(start_date, '%Y-%m-%d')).days + 1

        avg_per_day = transaction_count / days_diff if days_diff > 0 else 0

        spending_ratio = 0
        if total_income > 0:
            spending_ratio = float(total_expenses / total_income * 100)

        net_amount = total_income - total_expenses
        financial_health = 'positive' if net_amount >= 0 else 'negative'

        return {
            'spending_ratio': round(spending_ratio, 1),
            'avg_transactions_per_day': round(avg_per_day, 1),
            'days_in_period': days_diff,
            'financial_health': financial_health,
        }

    @staticmethod
    def get_category_breakdown(user, start_date, end_date):
        """
        Get category-wise breakdown of transactions

        Returns:
            dict: Breakdown by income and expense categories
        """
        queryset = Transaction.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=end_date
        )

        breakdown = {
            'income': [],
            'expense': []
        }

        for trans_type in ['income', 'expense']:
            categories = queryset.filter(type=trans_type).values('category').annotate(
                total=Sum('amount'),
                count=Count('id')
            ).order_by('-total')

            breakdown[trans_type] = [
                {
                    'category': cat['category'],
                    'total': float(cat['total']),
                    'count': cat['count']
                }
                for cat in categories
            ]

        return breakdown

    @staticmethod
    def save_report(user, title, start_date, end_date, report_type='all'):
        """
        Save a generated report for future reference

        Returns:
            Report: Saved report instance
        """
        from report.models import Report

        # Generate report data
        report_data = ReportService.generate_report(
            user=user,
            start_date=start_date,
            end_date=end_date,
            report_type=report_type
        )

        # Create and save report
        report = Report.objects.create(
            user=user,
            title=title,
            report_type=report_type,
            start_date=start_date,
            end_date=end_date,
            total_transactions=report_data['summary']['total_transactions'],
            total_income=report_data['summary']['total_income'],
            total_expenses=report_data['summary']['total_expenses'],
            net_amount=report_data['summary']['net_amount'],
            spending_ratio=report_data['insights']['spending_ratio'],
            avg_transactions_per_day=report_data['insights']['avg_transactions_per_day'],
        )

        return report