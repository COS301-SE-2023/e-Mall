from rest_framework import serializers
from .models import Staff


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = (
            'id', 'fname', 'sname', 'password', 'email', 'role', 'created_at', 'last_login', 'is_staff', 'is_active', 'is_superuser')
