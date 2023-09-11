from firebase_admin import firestore
from rest_framework.response import Response

# Initialize Firebase
db = firestore.client()
user_collection = "users"
product_collection = "products"
combo_collection = "combos"
message_types = ["user", "query", "wishlist", "follower","combo"]
user_logs_collection = "logs"  # sent to user
follower_logs_collection = "follower_logs"  # sent to followers
combo_logs_collection = "combo_logs"  # sent to followers



# when 'create' adding to pending collection
   # inivting (request.user) is always active user
   # target_users are a list of users to be added to pending collection
# when 'accect' adding to active collection
# when 'leave' removing from active collection

def update_combo(user_ids, combo_id, action, owner_id= None):
    try:
        if not all([user_ids, combo_id, action]):
            raise Exception("Missing required parameters")
        user_ids = [str(user_id) for user_id in user_ids]
        combo_id = str(combo_id)
        
        combo_ref = db.collection(combo_collection).document(combo_id)
        combo_doc = combo_ref.get()

        if action == "create" and owner_id is not None:
            owner_id= str(owner_id)
            update_data= {"pending_users" : firestore.ArrayUnion(user_ids),"active_users" : firestore.ArrayUnion([owner_id])}
        elif action == "leave":
            update_data= {"active_users" : firestore.ArrayRemove(user_ids)}
        elif action == "accept":
            update_data= {"pending_users" : firestore.ArrayRemove(user_ids)}
            update_data= {"active_users" : firestore.ArrayRemove(user_ids)}

        elif action == "reject":
            update_data= {"pending_users" : firestore.ArrayRemove(user_ids)}
            
        elif action == "edit":
            update_data= {"pending_users" : firestore.ArrayUnion(user_ids)}
            
        else:
            raise Exception("Invalid action")

        if combo_doc.exists:
            print("update_data,doc exists", update_data)
            combo_ref.update(update_data)
        else:
            if action == "create": #when creating new one
                print("update_data, doc doesnt exist", update_data)
                combo_ref.set(update_data)
            else:
                combo_ref.set({"active_users": [], "pending_users": []})

        return Response(
            {
                "status": "success",
                "message": 'message',
            }
        )
    except Exception as e:
        print(e)
        return Response({"status": "error", "message": str(e)})


def update_wishlist(user_id, product_id, action):
    try:
        if not all([user_id, product_id, action]):
            raise Exception("Missing required parameters")
        
        user_id = str(user_id)
        
        product_id = str(product_id)
        
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
            else:
                product_ref.set({"wishlisted_users": []})
                
        return {
                "status": "success",
                "message": f'Product {product_id} {"added to" if action == "add" else "removed from"} wishlist for user {user_id}',
            }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}


def send_message(data):
    try:
        main_collection_name = user_collection
        target_id = data.get("target")
        msg_type = data.get("message_type")
        image = data.get("image")
        message = data.get("message")
        title = data.get("title")
        sender= str(data.user.id)
        target= str(target_id) 
                
        data = {
            "image": image,
            "is_read": False,
            "message": message,
            "message_type": msg_type,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "title": title,
            "sender": sender,
            "target": target
        }

        if msg_type not in message_types:
            raise Exception("invalid parameter")

        sub_collection_name = user_logs_collection
        
        #new follower, follwing seller has new update
        if msg_type == "follower": 
            sub_collection_name = follower_logs_collection
        
        #new follwing product has new update
        elif msg_type == "wishlist":
            main_collection_name = product_collection
        
        #update on active user list, new pending user
        elif msg_type == "combo":
            main_collection_name = combo_collection
            sub_collection_name= combo_logs_collection
            
        doc_ref = (
            db.collection(main_collection_name)
            .document(target_id)
            .collection(sub_collection_name)
            .document()
        )
        doc_id = doc_ref.id
        data['id']= doc_id

        doc_ref.set(data)

        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def update_followed_users(customer_id, seller_id, action):
    try:
        if not all([seller_id, customer_id, action]):
            raise Exception("Missing required parameters")

        seller_id = str(seller_id)
        customer_id = str(customer_id)
        
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
            else:
                user_ref.set({"followed_users": []})

        return {
                "status": "success",
                "message": f'User {customer_id} {"added to" if action == "add" else "removed from"} followed users for user {seller_id}',
            }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}
