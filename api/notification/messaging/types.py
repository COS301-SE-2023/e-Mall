from consumer.models import Consumer


class MessageType:
    class User:
        GENERAL = "general"
        ALERT = "alert"
        QUERY = "query"

    class Wishlist:
        PRICE_ALERT = "price_alert"

    class Follower:
        NEW_FOLLOWER = "new_follower"
        UPDATE = "update"

    class Combo:
        CREATE = "create"
        EDIT = "edit"
        ACCEPT = "accept"
        REJECT = "reject"
        LEAVE = "leave"
        INVITE = "invite"
        ADD = "add"

    @staticmethod
    def get_type(variable):
        for type_name, type_class in vars(MessageType).items():
            if isinstance(type_class, type):
                for action_name, action_value in vars(type_class).items():
                    if action_value == variable:
                        return type_name.lower()
        raise ValueError(f"MessageType : Invalid variable: {variable}")

    @staticmethod
    def get_action(variable):
        for type_name, type_class in vars(MessageType).items():
            if isinstance(type_class, type):
                for action_name, action_value in vars(type_class).items():
                    if action_value == variable:
                        return action_name.lower()
        raise ValueError(f"MessageType : Invalid variable: {variable}")


class MessageUser:
    def __init__(self, user):
        obj_type = user.__class__.__name__
        self.id = user.id
        if obj_type == "Consumer" or obj_type == "Seller":
            self.name = user.username

        elif obj_type == "Seller":
            self.name = user.business_name

        elif obj_type == "Combos":
            self.name = user.combo_name

        else:
            raise Exception(f"type : {obj_type} doesn't exist")

        if hasattr(user, "image") and user.image is not None:
            self.image = user.image
        else:
            self.image = ""

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": str(self.name),
            "image": str(self.image),
        }
