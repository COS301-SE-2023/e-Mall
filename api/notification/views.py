from django.http import JsonResponse
from firebase_admin import firestore
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .swagger import *

# Initialize Firebase
db = firestore.client()
user_collection = "users"
product_collection = "products"
message_types = ["user", "query", "wishlist", "follower"]
singe_msg_collection_name = "logs"  # sent to user
multi_msg_collection_name = "follower_logs"  # sent to followers


@send_message_api_decorator
@api_view(["POST"])
def send_message_api(request):
    try:
        user_id = request.data.get("target")
        msg_type = request.data.get("message_type")
        image = request.data.get("image")
        message = request.data.get("message")
        title = request.data.get("title")

        if msg_type not in message_types:
            raise Exception("invalid parameter")

        sub_collection_name = singe_msg_collection_name
        if msg_type == "follower":
            sub_collection_name = multi_msg_collection_name

        doc_ref = (
            db.collection(user_collection)
            .document(user_id)
            .collection(sub_collection_name)
            .document()
        )
        doc_id = doc_ref.id

        data = {
            "id": doc_id,
            "image": image,
            "is_read": False,
            "message": message,
            "message_type": msg_type,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "title": title,
        }

        doc_ref.set(data)

        return Response({"status": "success"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@delete_decorator
@api_view(["POST"])
def delete(request):
    try:
        user_id = str(request.user.id)
        log_id = request.data.get("notification_id")
        db.collection(user_collection).document(user_id).collection(
            singe_msg_collection_name
        ).document(log_id).delete()
        return Response({"status": "success"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@read_decorator
@api_view(["POST"])
def delete_all(request):
    try:
        user_id = str(request.user.id)
        batch = db.batch()
        docs = (
            db.collection(user_collection)
            .document(user_id)
            .collection(singe_msg_collection_name)
            .stream()
        )
        for doc in docs:
            doc_ref = doc.reference
            batch.delete(doc_ref)
        batch.commit()
        return Response({"status": "success"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@get_decorator
@api_view(["POST"])
def read(request):
    try:
        user_id = str(request.user.id)
        log_id = request.data.get("notification_id")
        db.collection(user_collection).document(user_id).collection(
            singe_msg_collection_name
        ).document(log_id).update({"is_read": True})
        return Response({"status": "success"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@api_view(["POST"])
def read_all(request):
    try:
        user_id = str(request.user.id)
        batch = db.batch()
        docs = (
            db.collection(user_collection)
            .document(user_id)
            .collection(singe_msg_collection_name)
            .where("is_read", "==", False)
            .stream()
        )
        for doc in docs:
            doc_ref = doc.reference
            batch.update(doc_ref, {"is_read": True})
        batch.commit()
        return Response({"status": "success"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@api_view(["POST"])
def get(request):
    try:
        user_id = str(request.user.id)
        page_size = 5
        start_after = request.data.get("notification_id")

        logs_ref = (
            db.collection(user_collection)
            .document(user_id)
            .collection(singe_msg_collection_name)
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(page_size)
        )
        if start_after:
            start_after_doc = (
                db.collection(user_collection)
                .document(user_id)
                .collection(singe_msg_collection_name)
                .document(start_after)
                .get()
            )
            logs_ref = logs_ref.start_after(start_after_doc)

        logs = [doc.to_dict() for doc in logs_ref.stream()]
        last_log = logs[-1]
        if len(logs) == page_size:
            next_logs = (
                db.collection(user_collection)
                .document(user_id)
                .collection(singe_msg_collection_name)
                .order_by("timestamp", direction=firestore.Query.DESCENDING)
                .limit(1)
                .start_after(last_log)
                .stream()
            )
            hasNext = any(next_logs)
        else:
            hasNext = False

        response_data = {
            "has_next": hasNext,
            "notifications": logs,
        }
        return Response(response_data)
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@api_view(["POST"])
def update_device_token(request):
    try:
        device_token = request.data.get("device_token", "")
        user_id = str(request.user.id)
        user_ref = db.collection(user_collection).document(user_id)
        user_doc = user_ref.get()
        if user_doc.exists:
            stored_device_token = user_doc.to_dict().get("device_token")
            if stored_device_token == device_token:
                return Response(
                    {
                        "status": "success",
                        "message": "Device token is already up to date",
                    }
                )
        user_ref.set({"device_token": device_token}, merge=True)
        return Response(
            {"status": "success", "message": "Device token updated successfully"}
        )
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@api_view(["POST"])
def update_settings(request):
    try:
        user_id = str(request.user.id)
        user_ref = db.collection(user_collection).document(user_id)
        settings = request.data
        valid_fields = ["general", "following", "wishlist", "all"]

        if not settings:  # If settings is empty, set all fields to True
            settings = {field: True for field in valid_fields}

        for field in settings:
            if field not in valid_fields or not isinstance(settings[field], bool):
                raise Exception(f"Invalid field or value: {field}={settings[field]}")

        user_ref.set({"settings": settings}, merge=True)
        return Response(
            {"status": "success", "message": "Settings updated successfully"}
        )
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@api_view(["POST"])
def count_unread_notifications(request):
    try:
        print("got here")
        user_id = str(request.user.id)
        logs_ref = (
            db.collection(user_collection)
            .document(user_id)
            .collection(singe_msg_collection_name)
            .where("is_read", "==", False)
        )
        count = len(logs_ref.get())
        response_data = {
            "status": "success",
            "unread_count": count,
        }
        print(response_data)
        return Response(response_data)
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


def update_wishlist(user_id, product_id, action):
    try:
        user_id = str(user_id)
        product_id = str(product_id)
        if not all([user_id, product_id, action]):
            raise Exception("Missing required parameters")

        product_ref = db.collection(product_collection).document(product_id)
        product_doc = product_ref.get()

        if action == "add":
            update_data = {"wishlisted_users": firestore.ArrayUnion([user_id])}
        elif action == "remove":
            update_data = {"wishlisted_users": firestore.ArrayRemove([user_id])}
        else:
            raise Exception("Invalid action")

        if product_doc.exists:
            product_ref.update(update_data)
        else:
            # The document does not exist, create it
            if action == "add":
                product_ref.set({"wishlisted_users": [user_id]})
            else:
                # If the action is "remove" and the document does not exist, do nothing
                pass

        return Response(
            {
                "status": "success",
                "message": f'Product {product_id} {"added to" if action == "add" else "removed from"} wishlist for user {user_id}',
            }
        )
    except Exception as e:
        print("in total exception", e)
        return Response({"status": "error", "message": str(e)})


def send_message(data):
    try:
        user_id = data.get("user_id")
        msg_type = data.get("msg_type")
        image = data.get("image")
        message = data.get("message")
        title = data.get("title")

        if msg_type not in message_types:
            raise Exception("invalid parameter")

        sub_collection_name = singe_msg_collection_name
        if msg_type == "follower":
            sub_collection_name = multi_msg_collection_name

        doc_ref = (
            db.collection(user_collection)
            .document(user_id)
            .collection(sub_collection_name)
            .document()
        )
        doc_id = doc_ref.id

        data = {
            "id": doc_id,
            "image": image,
            "is_read": False,
            "message": message,
            "message_type": msg_type,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "title": title,
        }

        doc_ref.set(data)

        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
