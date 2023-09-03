import string
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from .serializers import (
    ConsumerProfileSerializer,
    SellerProfileSerializer,
    ProductSerializer,
)
from consumer.models import Consumer
from seller.models import Seller
from product.models import Product
from ca_matrix.models import ca_matrix
import numpy as np
import pandas as pd
from notification.utils import update_wishlist
from notification.utils import update_followed_users


@api_view(["POST"])
def get(request):
    try:
        user = request.user
        serializer = None
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            serializer = ConsumerProfileSerializer(user)
        elif user.type == "seller":
            serializer = SellerProfileSerializer(user)
        if serializer is None:
            raise Exception("Serializer not found")
        return Response(serializer.data)
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def update(request):
    try:
        user = request.user
        serializer = None
        if user is None:
            raise Exception("User not found")
        data = request.data.copy()
        details_data = data.pop("details", {})
        data.update(details_data)
        if user.type == "consumer":
            serializer = ConsumerProfileSerializer(user, data=data, partial=True)

        elif user.type == "seller":
            serializer = SellerProfileSerializer(user, data=data, partial=True)
        if serializer is None:
            raise Exception("Serializer not found")
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def updateWishlist(request):
    try:
        user = request.user
        product_id = request.data.get("prod_id")
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            consumer = Consumer.objects.get(email=user.email)
            if product_id in consumer.wishlist:
                consumer.wishlist.remove(product_id)
                res = update_wishlist(user.id, product_id, "remove")
            else:
                consumer.wishlist.append(product_id)
                res = update_wishlist(user.id, product_id, "add")
            if res.get("status") == "error":
                raise Exception(res.get("message"))
            consumer.save()
            return Response({"success": True})
        else:
            raise Exception("Seller cannot have wishlist")
    except Exception as e:
        print(e)
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def updateFollowedSellers(request):
    try:
        user = request.user
        seller_name = request.data.get("seller_name")
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            consumer = Consumer.objects.get(email=user.email)
            seller = Seller.objects.get(business_name=seller_name)
            if seller_name in consumer.followed_sellers:
                consumer.followed_sellers.remove(seller_name)
                res = update_followed_users(user.id, seller.id, "remove")
            else:
                consumer.followed_sellers.append(seller_name)
                res = update_followed_users(user.id, seller.id, "add")
            if res.get("status") == "error":
                raise Exception(res.get("message"))
            consumer.save()
            return Response({"success": True})
        else:
            raise Exception("Seller cannot follow sellers")
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def get_followed_seller_details(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            followed_seller = []
            if user.followed_sellers is not None and len(user.followed_sellers) > 0:
                followed_seller = Seller.objects.filter(
                    business_name__in=user.followed_sellers
                )
                res = [
                    {"id": seller.id, "name": seller.business_name, "logo": seller.logo}
                    for seller in followed_seller
                ]
                return Response(res)

        else:
            raise Exception("User is seller")
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def update_recommended_products(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            rec_prods = []
            # get the predictions data
            predictions_data = ca_matrix.objects.all()
            # create the df table
            df, df1 = createTables(predictions_data)
            for m in df[df[user.email] == 0].index.tolist():
                index_df = df.index.tolist().index(m)
                predicted_rating = df1.iloc[
                    index_df, df1.columns.tolist().index(user.email)
                ]
                rec_prods.append((m, predicted_rating))

            sorted_rm = sorted(rec_prods, key=lambda x: x[1], reverse=True)
            # find the consumer
            consumer = Consumer.objects.get(email=user.email)
            # remove old similar products array
            consumer.recommended_products = []
            # #add new similar products array

            for name, value in sorted_rm:
                consumer.recommended_products.append(name)

            consumer.save()

            return Response({"success": True})

        else:
            raise Exception("User is seller")
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def get_recommended_products(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            if (
                user.recommended_products is not None
                and len(user.recommended_products) > 0
            ):
                # get the recommended products by product name
                recommended_products = Product.objects.filter(
                    name__in=user.recommended_products
                )
            serializer = ProductSerializer(recommended_products, many=True)
            return Response(serializer.data)

        else:
            raise Exception("User is seller")

    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def createTables(predictions_data):
    # Prepare data for NearestNeighbors
    user_indices = predictions_data.values_list("user_email", flat=True)
    product_indices = predictions_data.values_list("product", flat=True)
    values = predictions_data.values_list("value", flat=True)

    # recreating the df table
    data = {"user_email": user_indices, "product": product_indices, "value": values}
    predictions_df = pd.DataFrame(data)
    # Pivot the data to create the table
    df = predictions_df.pivot(index="product", columns="user_email", values="value")
    df1 = df.copy()
    return df, df1
