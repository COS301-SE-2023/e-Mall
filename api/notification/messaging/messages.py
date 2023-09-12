from firebase_admin import firestore
from rest_framework.response import Response
from .templates import *
from .types import MessageType, MessageUser

# Initialize Firebase
db = firestore.client()


class Message:
    def __init__(self, action, template, doc, sender, receiver):
        if not isinstance(doc, MessageUser):
            raise Exception("Invalid document")
        sender = sender.to_dict()
        receiver = [
            user.to_dict() for user in receiver if isinstance(user, MessageUser)
        ]

        self.message_type = MessageType.get_type(action)
        self.action = action
        self.template_data = template.getData()

        self.doc = doc
        self.sender = sender
        self.receiver = receiver

        self.validate()

    def validate(self):
        if None in [
            self.message_type,
            self.action,
            self.template_data,
            self.doc,
            self.sender,
            self.receiver,
        ]:
            raise ValueError("Message: One or more parameters are None")

    def send_to_combo(self):
        print("send_to_combo")
        self.send("combos", self.doc.id, "logs")

    def send_to_user(self):
        self.send("users", self.doc.id, "logs")

    def send_to_product(self):
        self.send("products", self.doc.id, "logs")

    def send_to_follwer(self):
        self.send("followers", self.doc.id, "logs")

    def send(self, main, doc_id, sub):
        try:
            data = self.template_data
            print(1)
            data.update(
                {
                    "doc": self.doc.to_dict(),
                    "message_type": self.message_type,
                    "is_read": False,
                    "action": self.action,
                    "timestamp": firestore.SERVER_TIMESTAMP,
                    "sender": self.sender,
                    "targets": self.receiver,
                }
            )
            print(2)

            doc_ref = (
                db.collection(main).document(str(doc_id)).collection(sub).document()
            )
            new_doc_id = doc_ref.id
            data["id"] = new_doc_id
            doc_ref.set(data)
            print(3, main, str(doc_id), sub, new_doc_id)

            return {"status": "success"}
        except Exception as e:
            print(e)
            return {"status": "error", "message": str(e)}
