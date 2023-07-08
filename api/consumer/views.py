from .serializers import ConsumerSerializer
from .models import Consumer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import AllowAny
from rest_framework import status

# temporary import
from faker import Faker


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    request.data['username'] = Faker().user_name()[:15]
    serializer = ConsumerSerializer(data=request.data)
    if not serializer.is_valid():
        for field, error in serializer.errors.items():
            print(f"Error in field {field}: {error}")
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response({'message': 'Consumer registered successfully'}, status=status.HTTP_201_CREATED)
