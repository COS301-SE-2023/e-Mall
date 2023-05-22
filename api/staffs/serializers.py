from rest_framework import serializers
from .models import Staffs


class StaffsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staffs
        fields = (
            'id', 'fname', 'sname', 'password', 'email', 'role', 'created_at', 'last_login', 'is_staff', 'is_active', 'is_superuser')
