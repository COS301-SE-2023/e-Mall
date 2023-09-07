from firebase_admin import firestore
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .swagger.decorator import *

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
        main_collection_name = user_collection
        target_id = request.data.get("target")
        msg_type = request.data.get("message_type")
        image = request.data.get("image")
        message = request.data.get("message")
        title = request.data.get("title")

        if msg_type not in message_types:
            raise Exception("invalid parameter")

        sub_collection_name = singe_msg_collection_name
        if msg_type == "follower":
            sub_collection_name = multi_msg_collection_name
        elif msg_type == "wishlist":
            main_collection_name = product_collection

        doc_ref = (
            db.collection(main_collection_name)
            .document(target_id)
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


@delete_all_decorator
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


@read_decorator
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


@read_all_decorator
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


@get_decorator
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

        docs = list(logs_ref.stream())
        if not docs:
            return Response({"has_next": False, "notifications": []})
        logs = [
            {
                "notification": {
                    "title": doc.to_dict()["title"],
                    "body": doc.to_dict()["message"],
                    "image": doc.to_dict()["image"],
                },
                "data": {
                    "id": doc.id,
                    "is_read": str(doc.to_dict()["is_read"]),
                    "timestamp": doc.to_dict()["timestamp"],
                },
            }
            for doc in docs
        ]
        last_log = docs[-1]

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
        print(e)
        return Response({"status": "error", "message": str(e)})


@update_device_token_decorator
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


@update_settings_decorator
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


@count_unread_notifications_decorator
@api_view(["POST"])
def count_unread_notifications(request):
    try:
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
        return Response(response_data)
    except Exception as e:
        return Response({"status": "error", "message": str(e)})
