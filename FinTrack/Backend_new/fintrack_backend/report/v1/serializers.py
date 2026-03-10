# reports/v1/serializers.py
from rest_framework import serializers
from report.models import Report, ReportSchedule
from transactions.v1.serializers import TransactionSerializer


class ReportSummarySerializer(serializers.Serializer):
    """Serializer for report summary data"""
    total_transactions = serializers.IntegerField()
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=12, decimal_places=2)
    net_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    report_type = serializers.CharField()


class ReportInsightsSerializer(serializers.Serializer):
    """Serializer for report insights"""
    spending_ratio = serializers.FloatField()
    avg_transactions_per_day = serializers.FloatField()
    days_in_period = serializers.IntegerField()
    financial_health = serializers.CharField()


class ReportDetailSerializer(serializers.Serializer):
    """Complete report with summary, insights, and transactions"""
    summary = ReportSummarySerializer()
    insights = ReportInsightsSerializer()
    transactions = TransactionSerializer(many=True)


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for saved reports"""
    class Meta:
        model = Report
        fields = [
            'id',
            'title',
            'report_type',
            'start_date',
            'end_date',
            'total_transactions',
            'total_income',
            'total_expenses',
            'net_amount',
            'spending_ratio',
            'avg_transactions_per_day',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CategoryBreakdownSerializer(serializers.Serializer):
    """Serializer for category breakdown"""
    category = serializers.CharField()
    total = serializers.DecimalField(max_digits=12, decimal_places=2)
    count = serializers.IntegerField()


class ReportScheduleSerializer(serializers.ModelSerializer):
    """Serializer for report schedules"""
    class Meta:
        model = ReportSchedule
        fields = [
            'id',
            'name',
            'frequency',
            'report_type',
            'is_active',
            'email_report',
            'last_generated',
            'next_generation',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'last_generated', 'created_at', 'updated_at']