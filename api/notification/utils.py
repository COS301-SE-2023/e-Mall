from firebase_admin import firestore
from rest_framework.response import Response

# Initialize Firebase
db = firestore.client()
user_collection = "users"
product_collection = "products"
combo_collection = "combos"
message_types = ["user", "query", "wishlist", "follower", "combo"]
singe_msg_collection_name = "logs"  # sent to user
multi_msg_collection_name = "follower_logs"  # sent to followers

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
        # print("combo_doc", combo_doc)
        # print("combo_doc.exists", combo_doc.exists)
        # users_array = [str(user_id) for user_id in user_ids]
        # pending_ids_array = [str(user_id) for user_id in user_ids[1:]]
        # current_user_array = [str(user_ids[0])]

        # update_data = {}
        
        if action == "create" and owner_id is not None:

            owner_id= str(owner_id)
            # if pending_ids_array != []:
            print('user_ids', user_ids)
            print('owener_id ',owner_id)
            update_data= {"pending_users" : firestore.ArrayUnion(user_ids),"active_users" : firestore.ArrayUnion([owner_id])}
                # update_data["active_users"] = firestore.ArrayUnion(current_user_array)
            # else:
                # update_data["active_users"] = firestore.ArrayUnion(users_array)
        elif action == "leave":
            update_data= {"active_users" : firestore.ArrayRemove(user_ids)}
            # update_data["active_users"] = firestore.ArrayRemove(user_ids)
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

                
                # combo_ref.set(
                #     {
                #         "pending_users": pending_ids_array,
                #         "active_users": current_user_array,
                #     }
                # )

        # if action == "create":
        #     message = (
        #         f'Combo {combo_id} created with user {", ".join(current_user_array)}'
        #     )
        # elif action == "leave":
        #     message = f'User {", ".join(current_user_array)} left combo {combo_id}'
        # elif action == "accept":
        #     message = f'User {", ".join(current_user_array)} accepted the invitation to combo {combo_id}'
        # elif action == "reject":
        #     message = f'User {", ".join(pending_ids_array)} rejected the invitation to combo {combo_id}'
        # elif action == "edit":
        #     message = f'Combo {combo_id} edited with users {", ".join(users_array)}'
        # else:
        #     message = ""

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
