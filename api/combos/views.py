from django.shortcuts import render
import string
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import Combos
from rest_framework import status
from product.serializers import ProductSerializer
from product.models import Product
from user.models import User
from consumer.models import Consumer
from consumer.serializers import ConsumerSerializer
from notification.utils import update_combo


# Create your views here.


@api_view(["POST"])
def create(request):
    try:
        user = request.user
        combo_name = request.data["combo_name"]
        product_ids = request.data["product_ids"]
        pending_emails = request.data["user_emails"]
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot create combos")
        if user.type == "consumer":
            # add to db

            combo = Combos(
                combo_name=combo_name,
                user_emails=[user.email],
                product_ids=product_ids,
                pending_emails=pending_emails,
            )
            combo.save()
            # send notification to all users
            # get user ids
            users = Consumer.objects.filter(email__in=combo.pending_emails)
            user_ids = [target_user.id for target_user in users]
            print(user_ids)
            update_combo(user_ids, combo.id, "create", owner_id=user.id)
        return Response({"success": "Combo created successfully"})
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def update_user(request):
    try:
        user = request.user
        combo_id = request.data["combo_id"]
        action = request.data["action"]
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot create combos")
        if user.type == "consumer":
            if action == "Accept":
                # remove user email from pending emails and add to user emails
                combo = Combos.objects.get(id=combo_id)
                if user.email in combo.pending_emails:
                    combo.pending_emails.remove(user.email)
                    combo.user_emails.append(user.email)
                    combo.save()
                    update_combo([user.id], combo.id, "accept")
                    return Response({"success": "User added to Combo successfully"})

            if action == "Reject":
                # remove user email from pending emails
                combo = Combos.objects.get(id=combo_id)
                if user.email in combo.pending_emails:
                    if combo.user_emails == [] and len(combo.pending_emails) == 1:
                        combo.delete()
                        return Response({"success": "Combo deleted successfully"})
                    else:
                        combo.pending_emails.remove(user.email)
                        combo.save()
                        update_combo([user.id], combo.id, "reject")
                    return Response(
                        {"success": "User removed from pending emails successfully"}
                    )

    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def invite(request):
    try:
        user = request.user
        combo_ids = request.data["combo_ids"]
        user_emails = request.data["user_emails"]
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot create combos")
        if user.type == "consumer":
            # update existing combo
            for id in combo_ids:
                combo = Combos.objects.get(id=id)
                combo.pending_emails.extend(user_emails)
                combo.save()
                # get user ids
                users = Consumer.objects.filter(email__in=user_emails)
                user_ids = [user.id for user in users]
                update_combo(user_ids, combo.id, "invite")
        return Response({"success": "Combo updated successfully"})
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def removeProduct(request):
    try:
        user = request.user
        combo_id = request.data["combo_id"]
        product_id = request.data["product_id"]
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot create combos")
        if user.type == "consumer":
            # update existing combo
            combo = Combos.objects.get(id=combo_id)
            combo.product_ids.remove(product_id)
            combo.save()
        return Response({"success": "Combo updated successfully"})
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def edit(request):
    try:
        user = request.user
        combo_id = request.data["combo_id"]
        # combo_name = request.data["combo_name"]
        user_emails = request.data["user_emails"]
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot create combos")
        if user.type == "consumer":
            # update existing combo
            combo = Combos.objects.get(id=combo_id)
            combo.combo_name = combo.combo_name
            combo.save()
            # get user ids
            users = Consumer.objects.filter(email__in=combo.user_emails)
            user_ids = [user.id for user in users]
            # update_combo(user_ids, combo.id, "edit")
        return Response({"success": "Combo edited successfully"})
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def delete(request):
    try:
        user = request.user
        combo_id = request.data["combo_id"]
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot create combos")
        if user.type == "consumer":
            # delete existing combo
            combo = Combos.objects.get(id=combo_id)
            # check if user email is last email in the list
            if len(combo.user_emails) == 1 and combo.user_emails[0] == user.email:
                combo.delete()
                update_combo([user.id], combo.id, "leave")
                return Response({"success": "Combo deleted successfully"})
            elif user.email in combo.user_emails:
                combo.user_emails.remove(user.email)
                combo.save()
                update_combo([user.id], combo.id, "leave")
                return Response({"success": "User removed from Combo successfully"})
            else:
                raise Exception("User not found in Combo")

    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def get(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot access combos")
        if user.type == "consumer":
            # Get all combos for the user
            combos = Combos.objects.filter(user_emails__contains=[user.email])

            combo_data = []
            for combo in combos:
                products = Product.objects.filter(id__in=combo.product_ids)
                users = Consumer.objects.filter(email__in=combo.user_emails)
                usernames = [user.username for user in users]
                product_data = ProductSerializer(products, many=True).data
                combo_data.append(
                    {
                        "id": combo.id,
                        "name": combo.combo_name,
                        "products": product_data,
                        "active_usernames": usernames,
                        "active_emails": combo.user_emails,
                        "pending_users": combo.pending_emails,
                    }
                )

            return Response({"combos": combo_data})

    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def getInvites(request):
    try:
        user = request.user
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot access combos")
        if user.type == "consumer":
            # Get all combos for the user where the user is pending
            combos = Combos.objects.filter(pending_emails__contains=[user.email])

            combo_data = []
            for combo in combos:
                # add id and name to combo_data
                combo_data.append(
                    {
                        "id": combo.id,
                        "name": combo.combo_name,
                    }
                )

            return Response({"combos": combo_data})
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
