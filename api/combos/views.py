from django.shortcuts import render
import string
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

# from notification.utils import update_combo
from notification.messaging.templates import ComboTemplate
from notification.messaging.types import MessageUser, MessageType
from notification.messaging.messages import Message

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
            # check if emails exists in consumer database
            consumer_emails = []
            non_existing_emails = []

            for email in pending_emails.copy():
                if Consumer.objects.filter(email=email).exists():
                    consumer_emails.append(email)
                else:
                    non_existing_emails.append(email)

            combo = Combos(
                combo_name=combo_name,
                user_emails=[user.email],
                product_ids=product_ids,
                pending_emails=consumer_emails,
            )
            combo.save()

            # build data for message
            users = Consumer.objects.filter(email__in=combo.pending_emails)
            combo_template = ComboTemplate()
            params = {
                "action": MessageType.Combo.CREATE,
                "template": combo_template.invite,
                "doc": combo,
                "sender": user,
                "receivers": users,
            }

            Message(**params).send_to_combo()

        return Response(
            {
                "success": "Combo created successfully",
                "Unsuccessful": non_existing_emails,
                "Successful": consumer_emails,
                "collection_id": combo.id,
            }
        )
    except Exception as e:
        print("create error", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def update_user(request):
    try:
        user = request.user
        combo_id = request.data["collection_id"]
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
                    # build data for message
                    users = Consumer.objects.filter(email__in=combo.user_emails)
                    combo_template = ComboTemplate()
                    params = {
                        "action": MessageType.Combo.ACCEPT,
                        "template": combo_template.accept,
                        "doc": combo,
                        "sender": user,
                        "receivers": users,
                    }
                    Message(**params).send_to_combo()

                    combo.pending_emails.remove(user.email)
                    combo.user_emails.append(user.email)
                    combo.save()
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

                    return Response(
                        {"success": "User removed from pending emails successfully"}
                    )

    except Exception as e:
        print("error message is ", e)
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def invite(request):
    try:
        user = request.user
        combo_id = request.data["collection_id"]
        user_emails = request.data["user_emails"]
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot create combos")
        if user.type == "consumer":
            # update existing combo
            combo = Combos.objects.get(id=combo_id)
            consumer_emails = []
            existing_emails = []
            nonexisting_emails = []
            # check if emails exists in consumer database
            for email in user_emails.copy():
                if Consumer.objects.filter(email=email).exists():
                    consumer_emails.append(email)
                else:
                    nonexisting_emails.append(email)

            # confirm emails are not already in combo
            for email in consumer_emails.copy():
                if email in combo.pending_emails or email in combo.user_emails:
                    existing_emails.append(email)
                    consumer_emails.remove(email)
            combo.pending_emails.extend(consumer_emails)
            combo.save()
            # build data for message
            users = Consumer.objects.filter(email__in=consumer_emails)
            combo_template = ComboTemplate()
            params = {
                "action": MessageType.Combo.INVITE,
                "template": combo_template.invite,
                "doc": combo,
                "sender": user,
                "receivers": users,
            }
            Message(**params).send_to_combo()
        # return user emails and consumer emails
        return Response(
            {
                "success": "User invited to Combo successfully",
                "collection_id": combo.id,
                "Unsuccessful": nonexisting_emails,
                "Successful": consumer_emails,
                "Existing": existing_emails,
            }
        )
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def removeProduct(request):
    try:
        user = request.user
        combo_id = request.data["collection_id"]
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
        combo_id = request.data["collection_id"]
        combo_name = request.data["combo_name"]
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot create combos")
        if user.type == "consumer":
            # update existing combo
            combo = Combos.objects.get(id=combo_id)
            combo.combo_name = combo_name
            combo.save()
        return Response({"success": "Combo edited successfully"})
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def delete(request):
    try:
        user = request.user
        combo_id = request.data["collection_id"]
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
                return Response({"success": "Combo deleted successfully"})
            elif user.email in combo.user_emails:
                combo.user_emails.remove(user.email)
                combo.save()
                # build data for message
                users = Consumer.objects.filter(email__in=combo.user_emails)
                combo_template = ComboTemplate()
                params = {
                    "action": MessageType.Combo.LEAVE,
                    "template": combo_template.leave,
                    "doc": combo,
                    "sender": user,
                    "receivers": users,
                }

                Message(**params).send_to_combo()
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


@api_view(["POST"])
def addProduct(request):
    try:
        user = request.user
        combo_ids = request.data["collection_ids"]
        product_id = request.data["product_id"]
        if user is None:
            raise Exception("User not found")
        if user.type == "seller":
            raise Exception("Seller cannot access combos")
        if user.type == "consumer":
            for id in combo_ids:
                combo = Combos.objects.get(id=id)
                combo.product_ids.append(product_id)
                combo.save()
                # build data for message
                user_emails = combo.user_emails
                user_emails.remove(user.email)
                users = Consumer.objects.filter(email__in=user_emails)
                combo_template = ComboTemplate()
                params = {
                    "action": MessageType.Combo.ADD,
                    "template": combo_template.add,
                    "doc": combo,
                    "sender": user,
                    "receivers": users,
                }
                Message(**params).send_to_combo()
            return Response({"success": "Product added to combo successfully"})
    except Exception as e:
        # handle other exceptions here
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
