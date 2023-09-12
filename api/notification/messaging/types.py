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
    def __init__(self, id, name="Anonymous User", image=""):
        if id is None:
            raise Exception("MessageUser: ID cannot be None")
        self.id = id
        self.name = name
        self.image = image

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": str(self.name),
            "image": str(self.image),
        }
