# reports/v1/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReportGenerateView,
    ReportExportCSVView,
    ReportCategoryBreakdownView,
    ReportViewSet,
    ReportScheduleViewSet,
    ReportStatsView,
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'saved', ReportViewSet, basename='report')
router.register(r'schedules', ReportScheduleViewSet, basename='report-schedule')

urlpatterns = [
    # Report generation and export
    path('generate/', ReportGenerateView.as_view(), name='report-generate'),
    path('export-csv/', ReportExportCSVView.as_view(), name='report-export-csv'),
    path('category-breakdown/', ReportCategoryBreakdownView.as_view(), name='report-category-breakdown'),
    path('stats/', ReportStatsView.as_view(), name='report-stats'),

    # ViewSets (saved reports and schedules)
    path('', include(router.urls)),
]