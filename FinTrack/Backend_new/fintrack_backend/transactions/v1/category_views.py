from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Category
from .serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing categories.
    Supports CRUD operations for custom user categories.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    
    def get_queryset(self):
        """Return categories for the authenticated user only"""
        return Category.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Automatically set the user when creating a category"""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Ensure user ownership on update"""
        serializer.save(user=self.request.user)
