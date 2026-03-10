from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings

# Swagger API documentation schema
schema_view = get_schema_view(
    openapi.Info(
        title="FinTrack API",
        default_version='v1',
        description="FinTrack - Personal Finance Management API Documentation",
        terms_of_service="https://www.fintrack.com/terms/",
        contact=openapi.Contact(email="contact@fintrack.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=settings.DEBUG,
    permission_classes=(
        permissions.AllowAny if settings.DEBUG else permissions.IsAdminUser,
    ),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('accounts.v1.urls')),
    path('api/v1/', include('transactions.v1.urls')),
    path('api/v1/', include('budget.v1.urls')),
    path('api/v1/reports/', include('report.v1.urls')),
    
    # Swagger API Documentation URLs
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
