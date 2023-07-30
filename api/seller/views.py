# from django.shortcuts import render
from django.forms import ValidationError
from rest_framework.response import Response

# from rest_framework.decorators import action
# from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from .serializers import SellerSerializer
from .models import Seller
from rest_framework.permissions import AllowAny

# from rest_framework import permissions
# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
# from django.shortcuts import get_object_or_404
# Create your views here.
from rest_framework import status

# temporary import
from faker import Faker

# class SellerView(ViewSet):
#     queryset = Seller.objects.all()
#     serializer_class = SellerSerializer
#     http_method_names = ['get', 'post', 'options']

#     def get_permissions(self):
#         if self.action == 'create':
#             permission_classes = [permissions.AllowAny]
#         else:
#             permission_classes = self.permission_classes
#         return [permission() for permission in permission_classes]

#     def create(self, request):
#         print(request.data)
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         print('it was valid')
#         self.perform_create(serializer)
#         print('create success')
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

#     # def update_is_verified(self, request, *args, **kwargs):
#     #     instance = self.get_object()
#     #     instance.is_verified = request.data.get('is_verified')
#     #     instance.save()
#     #     serializer = self.get_serializer(instance)
#     #     return Response(serializer.data)

#     @action(detail=True, methods=['get'])
#     def is_verified(self, request, *args, **kwargs):
#         instance = self.get_object()
#         return Response({'is_verified': instance.is_verified})

#     @action(detail=True, methods=['options', 'post', 'patch'], url_path='auth_test')
#     def auth_test(self, request):
#         print('auth_test: ', request.data)
#         return Response({'auth_test': 'success'})

#     # def retrieve(self, request, pk=None):
#     #     if '@' in pk:
#     #         queryset = self.get_queryset().filter(email=pk)
#     #         seller = queryset.first()
#     #         if seller is not None:
#     #             serializer = self.get_serializer(seller)
#     #             return Response(serializer.data)
#     #         else:
#     #             return Response({'detail': 'Seller not found.'}, status=status.HTTP_404_NOT_FOUND)
#     #     else:
#     #         return super().retrieve(request, pk)


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    request.data["username"] = Faker().user_name()[:15]
    request.data["reg_no"] = Faker().bothify("##############")
    request.data["business_name"] = Faker().company()
    serializer = SellerSerializer(data=request.data)
    if not serializer.is_valid():
        for field, error in serializer.errors.items():
            print(f"Error in field {field}: {error}")
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(
        {"message": "Seller registered successfully"}, status=status.HTTP_201_CREATED
    )


# testing if auth permission working
@api_view(["POST"])
# @permission_classes([AllowAny])
def auth_test(request):
    return Response({"message": "auth success"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def get_seller_info(request):
    try:
        seller = Seller.objects.get(id=request.data["seller_id"])
        serializer = SellerSerializer(seller)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Seller.DoesNotExist:
        return Response(
            {"message": "Seller does not exist"},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def update_seller_info(request):
    catalogue_size = int(request.data["catalogue_size"])
    website = request.data["website"]
    feed_url = request.data["feed_url"]
    no_employees = int(request.data["no_employees"])
    support_email = request.data["support_email"]
    landline_number = request.data["landline_number"]
    address = request.data["address"]
    city = request.data["city"]
    postal_code = request.data["postal_code"]
    try:
        seller = Seller.objects.get(email=request.data["email"])
        seller.catalogue_size = catalogue_size
        seller.website = website
        seller.feed_url = feed_url
        seller.no_employees = no_employees
        seller.support_email = support_email
        seller.landline_number = landline_number
        seller.address = address
        seller.city = city
        seller.postal_code = postal_code
        seller.save()
        return Response(
            {"message": "Seller info updated successfully"}, status=status.HTTP_200_OK
        )
    except Seller.DoesNotExist:
        return Response(
            {"message": "Seller does not exist"},
            status=status.HTTP_404_NOT_FOUND,
        )
