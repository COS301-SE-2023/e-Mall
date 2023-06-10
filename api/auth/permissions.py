from rest_framework import permissions
from seller.models import Seller
from consumer.models import Consumer


class CognitoPermission(permissions.BasePermission):
    def has_permission(self, request, view):

        if request.method in permissions.SAFE_METHODS:
            return True

        # only if user is valid and either seller or customer
        return request.user.is_authenticated and (isinstance(request.user, Seller) or isinstance(request.user, Consumer))

    def has_object_permission(self, request, view, obj):
        print('has_object_permission')
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        return True
        # if request.method in permissions.SAFE_METHODS:
        #     return True

        # # Instance must have an attribute named `owner`.
        # return obj.owner == request.user
