from abc import ABC


class MessageTemplate(ABC):
    def __init__(self):
        self.image = ""
        self.message = ""
        self.title = ""

    def getData(self):
        return {"image": self.image, "message": self.message, "title": self.title}


class ComboTemplate(MessageTemplate):
    @property
    def accept(self):
        self.message = "Welcome a new collaborator @[sender]"
        self.title = "New collaborator to '[combo]' "
        return self

    @property
    def invite(self):
        self.message = "@[sender] has invited you to '[combo]'"
        self.title = "You have been invited to '[combo]'"
        return self

    @property
    def leave(self):
        self.message = "@[sender] has left from '[combo]'"
        self.title = "@[sender] left from '[combo]'"
        return self

    @property
    def add(self):
        self.message = "@[sender] has added a product to '[combo]'"
        self.title = "@[sender] added a product to '[combo]'"
        return self


class RegisterTemplate(MessageTemplate):
    @property
    def register(self):
        self.message = "Welcome to E-mall, @[sender] ! We are glad to have you here! Please edit your profile to get started!"
        self.title = "Welcome to E-mall!"
        return self


class UserTemplate(MessageTemplate):
    def __init__(self, sender, targetName=""):
        super().__init__()
        self.sender = sender
        self.target = targetName

    @property
    def alert(self):
        self.message = f"{self.sender} has sent an alert"
        self.title = "You have a new alert"
        return self


# class WishlistTemplate(MessageTemplate):
#     def __init__(self, sender, targetName=""):
#         super().__init__()
#         self.sender = sender
#         self.target = targetName

# def alert(self):
#     self.message = f"{self.sender} has sent an alert"
#     self.title = "You have a new alert"

# class FollowerTemplate(MessageTemplate):
#     def __init__(self, sender, targetName=""):
#         super().__init__()
#         self.sender = sender
#         self.target = targetName

#     def alert(self):
#         self.message = f"{self.sender} has sent an alert"
#         self.title = "You have a new alert"
