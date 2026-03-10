import django_filters
from ..models import Transaction


class TransactionFilter(django_filters.FilterSet):

    start_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')

    min_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category', lookup_expr='exact')
    type = django_filters.ChoiceFilter(
        field_name='type',
        choices=Transaction.TYPE_CHOICES
    )
    merchant = django_filters.CharFilter(field_name='merchant', lookup_expr='icontains')

    class Meta:
        model = Transaction
        fields = ['category', 'type', 'date', 'merchant']