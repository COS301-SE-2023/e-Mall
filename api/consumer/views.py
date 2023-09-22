from .serializers import ConsumerSerializer
from product.serializers import ProductSerializer
from seller.serializers import SellerSerializer
from .models import Consumer
from product.models import Product
from seller.models import Seller
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import AllowAny
from rest_framework import status

# temporary import
from faker import Faker


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    data = request.data.copy()
    data["username"] = Faker().user_name()[:15]
    serializer = ConsumerSerializer(data=data)
    if not serializer.is_valid():
        for field, error in serializer.errors.items():
            print(f"Error in field {field}: {error}")
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(
        {"message": "Consumer registered successfully"}, status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def update(request):
    followed_sellers = request.data["followed_sellers"]
    wishlist = request.data["wishlist"]
    try:
        consumer = Consumer.objects.get(email=request.data["email"])
        consumer.followed_sellers = followed_sellers
        consumer.wishlist = wishlist
        consumer.save()
        return Response(
            {"message": "Consumer updated successfully"}, status=status.HTTP_200_OK
        )
    except Consumer.DoesNotExist:
        return Response(
            {"message": "Consumer does not exist"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def get_consumer_info(request):
    try:
        consumer = Consumer.objects.get(email=request.data["email"])
        sellers_username = consumer.followed_sellers
        products_id = consumer.wishlist
        sellers = []
        products = []
        for seller_username in sellers_username:
            seller = Seller.objects.get(username=seller_username)
            sellers.append(seller)
        for product_id in products_id:
            product = Product.objects.get(id=product_id)
            products.append(product)
        serializer = SellerSerializer(sellers, many=True)
        seller_data = serializer.data
        serializer = ProductSerializer(products, many=True)
        product_data = serializer.data
        return Response(
            {
                "message": "Consumer info retrieved successfully",
                "seller_data": seller_data,
                "product_data": product_data,
            },
            status=status.HTTP_200_OK,
        )

    except Consumer.DoesNotExist:
        return Response(
            {"message": "Consumer does not exist"},
            status=status.HTTP_404_NOT_FOUND,
        )