# reports/v1/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets
from django.http import HttpResponse
import csv

from transactions.models import Transaction
from report.models import  Report, ReportSchedule
from .serializers import (
    ReportDetailSerializer,
    ReportSerializer,
    ReportScheduleSerializer,
)
from .services import ReportService


class ReportGenerateView(APIView):
    """Generate financial report with summary and transactions"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get query parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        report_type = request.query_params.get('type', 'all')

        # Validate dates
        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Use service to generate report
            report_data = ReportService.generate_report(
                user=request.user,
                start_date=start_date,
                end_date=end_date,
                report_type=report_type
            )

            serializer = ReportDetailSerializer(report_data)
            return Response(serializer.data)

        except Exception as e:
            from django.conf import settings as django_settings
            error_msg = str(e) if django_settings.DEBUG else "An error occurred while generating the report."
            return Response(
                {'error': error_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ReportExportCSVView(APIView):
    """Export transactions as CSV file"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        report_type = request.query_params.get('type', 'all')

        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Query transactions
        queryset = Transaction.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('-date')

        if report_type != 'all':
            queryset = queryset.filter(type=report_type)

        # Create CSV response
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="fintrack-report-{start_date}-to-{end_date}.csv"'

        # Add BOM for Excel compatibility
        response.write('\ufeff')

        writer = csv.writer(response)
        writer.writerow(['Date', 'Merchant', 'Category', 'Type', 'Amount', 'Notes'])

        for transaction in queryset:
            writer.writerow([
                transaction.date,
                transaction.merchant,
                transaction.category.name if transaction.category else 'Uncategorized',
                transaction.type,
                str(transaction.amount),
                transaction.notes or ''
            ])

        return response


class ReportCategoryBreakdownView(APIView):
    """Get category-wise breakdown for reports"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        breakdown = ReportService.get_category_breakdown(
            user=request.user,
            start_date=start_date,
            end_date=end_date
        )

        return Response(breakdown)


class ReportViewSet(viewsets.ModelViewSet):
    """ViewSet for managing saved reports"""
    permission_classes = [IsAuthenticated]
    serializer_class = ReportSerializer

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReportScheduleViewSet(viewsets.ModelViewSet):
    """ViewSet for managing report schedules"""
    permission_classes = [IsAuthenticated]
    serializer_class = ReportScheduleSerializer

    def get_queryset(self):
        return ReportSchedule.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReportStatsView(APIView):
    """Get overall report statistics"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reports = Report.objects.filter(user=request.user)

        stats = {
            'total_reports': reports.count(),
            'total_scheduled': ReportSchedule.objects.filter(
                user=request.user,
                is_active=True
            ).count(),
            'recent_reports': ReportSerializer(
                reports[:5],
                many=True
            ).data
        }

        return Response(stats)