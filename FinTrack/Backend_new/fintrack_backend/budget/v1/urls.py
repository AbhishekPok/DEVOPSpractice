from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BudgetViewSet

# Create router for viewsets
router = DefaultRouter()
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    path('', include(router.urls)),
]
