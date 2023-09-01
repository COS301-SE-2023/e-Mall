from django.http import JsonResponse
from firebase_admin import firestore
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Initialize Firebase
db = firestore.client()
collection_name = "notifications"


@api_view(["POST"])
def create(request):
    try:
        user_id = str(request.user.id)
        image = request.data.get("image")
        # is_read = request.data.get("is_read")
        message = request.data.get("message")
        # timestamp = request.data.get("timestamp")
        title = request.data.get("title")

        doc_ref = (
            db.collection(collection_name)
            .document(user_id)
            .collection("logs")
            .document()
        )
        doc_id = doc_ref.id

        data = {
            "id": doc_id,
            "image": image,
            "is_read": False,
            "message": message,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "title": title,
        }

        doc_ref.set(data)

        return Response({"status": "success"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@api_view(["POST"])
def delete(request):
    try:
        user_id = str(request.user.id)
        log_id = request.data.get("notification_id")
        db.collection(collection_name).document(user_id).collection("logs").document(
            log_id
        ).delete()
        return Response({"status": "success"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


@api_view(["POST"])
def read(request):
    try:
        user_id = str(request.user.id)
        log_id = request.data.get("notification_id")
        db.collection(collection_name).document(user_id).collection("logs").document(
            log_id
        ).update({"is_read": True})
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
            db.collection(collection_name)
            .document(user_id)
            .collection("logs")
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(page_size)
        )
        if start_after:
            start_after_doc = (
                db.collection(collection_name)
                .document(user_id)
                .collection("logs")
                .document(start_after)
                .get()
            )
            logs_ref = logs_ref.start_after(start_after_doc)

        logs = [doc.to_dict() for doc in logs_ref.stream()]
        last_log = logs[-1]
        if len(logs) == page_size:
            next_logs = (
                db.collection(collection_name)
                .document(user_id)
                .collection("logs")
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
        user_ref = db.collection(collection_name).document(user_id)
        user_ref.set({"device_token": device_token}, merge=True)
        return Response(
            {"status": "success", "message": "Device token updated successfully"}
        )
    except Exception as e:
        return Response({"status": "error", "message": str(e)})
