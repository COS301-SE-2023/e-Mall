from firebase_admin import firestore
from rest_framework.response import Response

# Initialize Firebase
db = firestore.client()
user_collection = "users"
product_collection = "products"
message_types = ["user", "query", "wishlist", "follower"]
singe_msg_collection_name = "logs"  # sent to user
multi_msg_collection_name = "follower_logs"  # sent to followers


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
            if action == "add":
                product_ref.set({"wishlisted_users": [user_id]})

        return Response(
            {
                "status": "success",
                "message": f'Product {product_id} {"added to" if action == "add" else "removed from"} wishlist for user {user_id}',
            }
        )
    except Exception as e:
        return Response({"status": "error", "message": str(e)})


def send_message(data):
    try:
        main_collection_name = user_collection
        target_id = data.get("target")
        msg_type = data.get("msg_type")
        image = data.get("image")
        message = data.get("message")
        title = data.get("title")

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

        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def update_followed_users(customer_id, seller_id, action):
    try:
        seller_id = str(seller_id)
        customer_id = str(customer_id)
        if not all([seller_id, customer_id, action]):
            raise Exception("Missing required parameters")

        user_ref = db.collection(user_collection).document(seller_id)
        user_doc = user_ref.get()

        if action == "add":
            update_data = {"followed_users": firestore.ArrayUnion([customer_id])}
        elif action == "remove":
            update_data = {"followed_users": firestore.ArrayRemove([customer_id])}
        else:
            raise Exception("Invalid action")

        if user_doc.exists:
            user_ref.update(update_data)
        else:
            if action == "add":
                user_ref.set({"followed_users": [customer_id]})

        return Response(
            {
                "status": "success",
                "message": f'User {customer_id} {"added to" if action == "add" else "removed from"} followed users for user {seller_id}',
            }
        )
    except Exception as e:
        return Response({"status": "error", "message": str(e)})
