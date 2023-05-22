from rest_framework import viewsets
from .serializers import StaffsSerializer
from .models import Staffs
# Create your views here.


class StaffsViewSet(viewsets.ModelViewSet):
    queryset = Staffs.objects.all()
    serializer_class = StaffsSerializer
