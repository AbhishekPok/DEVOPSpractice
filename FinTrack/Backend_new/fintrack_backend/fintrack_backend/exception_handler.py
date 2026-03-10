"""
Custom DRF exception handler for consistent API error responses.

All error responses follow the shape:
{
    "error": "Short error type",
    "detail": "Human-readable message or field-level errors",
    "status_code": 400
}
"""

from rest_framework.views import exception_handler
from rest_framework import status
from django.http import Http404
from django.core.exceptions import PermissionDenied
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Wraps DRF's default exception handler to produce consistent error responses.
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_type = _get_error_type(response.status_code)

        # If DRF returned field-level validation errors (dict), keep them nested
        if isinstance(response.data, dict) and 'detail' in response.data:
            detail = response.data['detail']
        elif isinstance(response.data, dict):
            detail = response.data
        elif isinstance(response.data, list):
            detail = response.data
        else:
            detail = str(response.data)

        response.data = {
            'error': error_type,
            'detail': detail,
            'status_code': response.status_code,
        }

        # Log server errors
        if response.status_code >= 500:
            view = context.get('view', None)
            logger.error(
                'Server error in %s: %s',
                view.__class__.__name__ if view else 'unknown',
                exc,
                exc_info=True,
            )

    return response


def _get_error_type(status_code):
    """Map HTTP status codes to human-readable error types."""
    error_map = {
        400: 'Bad Request',
        401: 'Authentication Failed',
        403: 'Permission Denied',
        404: 'Not Found',
        405: 'Method Not Allowed',
        409: 'Conflict',
        429: 'Rate Limit Exceeded',
        500: 'Internal Server Error',
    }
    return error_map.get(status_code, 'Error')
