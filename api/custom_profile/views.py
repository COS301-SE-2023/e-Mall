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

# from notification.utils import update_wishlist
# from notification.utils import update_followed_users
from celery import shared_task
from cust_analytics.views import post
from cust_analytics.models import cust_analytics


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
            if product_id not in consumer.wishlist:
                consumer.wishlist.append(product_id)
            # res = update_wishlist(user.id, product_id, "add")
            # if res.get("status") == "error":
            # raise Exception(res.get("message"))
            consumer.save()
            return Response({"success": True})
        else:
            raise Exception("Seller cannot have wishlist")
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def removeProductFromWishlist(request):
    try:
        user = request.user
        product_id = request.data.get("prod_id")
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            consumer = Consumer.objects.get(email=user.email)
            consumer.wishlist.remove(product_id)
            # res = update_wishlist(user.id, product_id, "remove")
            # if res.get("status") == "error":
            # raise Exception(res.get("message"))
            consumer.save()
            return Response({"success": True})
        else:
            raise Exception("Seller cannot have wishlist")
    except Exception as e:
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
                # res = update_followed_users(user.id, seller.id, "remove")
            else:
                consumer.followed_sellers.append(seller_name)
                # res = update_followed_users(user.id, seller.id, "add")
            # if res.get("status") == "error":
            # raise Exception(res.get("message"))
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
                return Response([])

        else:
            raise Exception("User is seller")
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@shared_task
def update_recommended_products(email):
    try:
        if email is None:
            return {"error": "User not found"}

        rec_prods = []
        # get the predictions data
        initial_data = ca_matrix.objects.all()
        prediction_data = cust_analytics.objects.all()
        # create the df table
        df = createTables(initial_data)
        df1 = createTables(prediction_data)

        for m in df[df[email] == 0].index.tolist():
            index_df = df.index.tolist().index(m)
            predicted_rating = df1.iloc[index_df, df1.columns.tolist().index(email)]
            if predicted_rating > 0:
                rec_prods.append((m, predicted_rating))

        sorted_rm = sorted(rec_prods, key=lambda x: x[1], reverse=True)
        # find the consumer
        consumer = Consumer.objects.get(email=email)
        # remove old similar products array
        consumer.recommended_products = []
        # #add new similar products array
        for name, value in sorted_rm:
            consumer.recommended_products.append(name)

        # Log the recommended products before and after the update

        consumer.save()

        return {"success": True}

    except Exception as e:
        # handle other exceptions here
        return {"error": str(e)}  # Return a dictionary with the error message


@api_view(["POST"])
def get_recommended_products(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "consumer":
            # Define recommended_products as an empty queryset initially
            recommended_products = Product.objects.none()
            if (
                user.recommended_products is not None
                and len(user.recommended_products) > 0
            ):
                # Update recommended_products if the user has recommendations
                recommended_products = Product.objects.filter(
                    name__in=user.recommended_products
                )
                # sort it the same way that the user has sorted it
                recommended_products = sorted(
                    recommended_products,
                    key=lambda x: user.recommended_products.index(x.name),
                )
            serializer = ProductSerializer(recommended_products, many=True)
            post.delay()
            update_recommended_products.delay(user.email)
            return Response(serializer.data)

        else:
            raise Exception("User is seller")

    except Exception as e:
        # Handle other exceptions here
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
    return df


@api_view(["POST"])
def getWishlistedProducts(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot have wishlist")
        else:
            consumer = Consumer.objects.get(email=user.email)
            wishlisted_products = Product.objects.filter(
                id__in=consumer.wishlist
            ).order_by("-created_at")
            serializer = ProductSerializer(wishlisted_products, many=True)
            return Response(serializer.data)
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
