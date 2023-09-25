from firebase_admin import firestore
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .swagger.decorator import (
    send_message_api_decorator,
    delete_decorator,
    delete_all_decorator,
    get_decorator,
    read_decorator,
    read_all_decorator,
    update_device_token_decorator,
    update_settings_decorator,
    count_unread_notifications_decorator,
)
from rest_framework import status

# Initialize Firebase
db = firestore.client()
user_collection = "users"
product_collection = "products"
combo_collection = "combos"
message_types = ["user", "query", "wishlist", "follower", "combo"]
user_logs_collection = "logs"  # sent to user
follower_logs_collection = "follower_logs"  # sent to followers
combo_logs_collection = "combo_logs"  # sent to followers


@send_message_api_decorator
@api_view(["POST"])
def send_message_api(request):
    try:
        main_collection_name = user_collection
        target_id = request.data.get("target")
        msg_type = request.data.get("message_type")
        image = (
            request.data.get("image") if request.data.get("image") is not None else ""
        )
        message = request.data.get("message")
        title = request.data.get("title")

        sender = str(request.user.id)
        target = str(target_id)

        data = {
            "image": image,
            "is_read": False,
            "message": message,
            "message_type": msg_type,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "title": title,
            "sender": sender,
            "target": target,
        }
        if msg_type not in message_types:
            raise Exception("invalid parameter")

        sub_collection_name = user_logs_collection

        # new follower, follwing seller has new update
        if msg_type == "follower":
            sub_collection_name = follower_logs_collection

        # new follwing product has new update
        elif msg_type == "wishlist":
            main_collection_name = product_collection

        # update on active user list, new pending user
        elif msg_type == "combo":
            main_collection_name = combo_collection
            sub_collection_name = combo_logs_collection

        doc_ref = (
            db.collection(main_collection_name)
            .document(target_id)
            .collection(sub_collection_name)
            .document()
        )
        doc_id = doc_ref.id
        data["id"] = doc_id

        doc_ref.set(data)

        return Response({"status": "success"})
    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@delete_decorator
@api_view(["POST"])
def delete(request):
    try:
        user_id = str(request.user.id)
        log_id = request.data.get("notification_id")
        if log_id is None:
            raise Exception("notification_id is required")
        db.collection(user_collection).document(user_id).collection(
            user_logs_collection
        ).document(log_id).delete()
        return Response({"status": "success"})
    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@delete_all_decorator
@api_view(["POST"])
def delete_all(request):
    try:
        user_id = str(request.user.id)
        batch = db.batch()
        docs = (
            db.collection(user_collection)
            .document(user_id)
            .collection(user_logs_collection)
            .stream()
        )
        for doc in docs:
            doc_ref = doc.reference
            batch.delete(doc_ref)
        batch.commit()
        return Response({"status": "success"})
    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@read_decorator
@api_view(["POST"])
def read(request):
    try:
        user_id = str(request.user.id)
        log_id = request.data.get("notification_id")
        if log_id is None:
            raise Exception("notification_id is required")
        db.collection(user_collection).document(user_id).collection(
            user_logs_collection
        ).document(log_id).update({"is_read": True})
        return Response({"status": "success"})
    except Exception as e:
        print(e)
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@read_all_decorator
@api_view(["POST"])
def read_all(request):
    try:
        user_id = str(request.user.id)
        batch = db.batch()
        docs = (
            db.collection(user_collection)
            .document(user_id)
            .collection(user_logs_collection)
            .where("is_read", "==", False)
            .stream()
        )
        for doc in docs:
            doc_ref = doc.reference
            batch.update(doc_ref, {"is_read": True})
        batch.commit()
        return Response({"status": "success"})
    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@get_decorator
@api_view(["POST"])
def get(request, page_size=15):
    try:
        user_id = str(request.user.id)
        start_after = request.data.get("notification_id")

        logs_ref = (
            db.collection(user_collection)
            .document(user_id)
            .collection(user_logs_collection)
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(page_size)
        )
        if start_after:
            start_after_doc = (
                db.collection(user_collection)
                .document(user_id)
                .collection(user_logs_collection)
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
                    **{
                        k: v
                        for k, v in doc.to_dict().items()
                        if k not in ["targets", "title", "message", "image"]
                    },
                    # "id": doc.id,
                    # "is_read": doc.to_dict()["is_read"],
                    # "timestamp": doc.to_dict()["timestamp"],
                },
            }
            for doc in docs
        ]
        last_log = docs[-1]

        if len(logs) == page_size:
            next_logs = (
                db.collection(user_collection)
                .document(user_id)
                .collection(user_logs_collection)
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
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


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
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@update_settings_decorator
@api_view(["POST"])
def update_settings(request):
    try:
        user_id = str(request.user.id)
        user_ref = db.collection(user_collection).document(user_id)
        settings = request.data.get("settings")
        valid_fields = ["general", "following", "wishlist", "all"]
        print(settings)
        if not settings:  # If settings is empty, set all fields to True
            settings = {field: True for field in valid_fields}

        for field in settings:
            if field not in valid_fields:
                raise Exception(f"Invalid field or value: {field}={settings[field]}")
            elif isinstance(settings[field], str) and (
                settings[field].lower() not in ["true", "false"]
            ):
                raise Exception(f"Invalid value: {field}={settings[field]}")

        user_ref.set({"settings": settings}, merge=True)
        return Response(
            {"status": "success", "message": "Settings updated successfully"}
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@count_unread_notifications_decorator
@api_view(["POST"])
def count_unread_notifications(request):
    try:
        user_id = str(request.user.id)
        user_ref = db.collection(user_collection).document(user_id)

        # Check if the user exists
        if not user_ref.get().exists:
            response_data = {
                "status": "success:no user exists",
                "unread_count": 0,
            }
            return Response(response_data)

        logs_ref = user_ref.collection(user_logs_collection).where(
            "is_read", "==", False
        )
        count = len(list(logs_ref.get()))
        response_data = {
            "status": "success",
            "unread_count": count,
        }
        return Response(response_data)
    except Exception as e:
        print(e)
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def get_settings(request):
    try:
        user_id = str(request.user.id)
        user_ref = db.collection(user_collection).document(user_id)
        doc = user_ref.get()
        if doc.exists:
            data = doc.to_dict()
            settings = data.get("settings", None)
        else:
            settings = None

        if settings is None:  # If settings field doesn't exist, set all fields to False
            valid_fields = ["general", "following", "wishlist", "all"]
            settings = {field: True for field in valid_fields}
        return Response(settings)

    except Exception as e:
        return Response(
            {"status": "error", "message": str(e)}, status=status.HTTP_404_NOT_FOUND
        )
