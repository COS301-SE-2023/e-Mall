from django.urls import path
from .views import (
    create,
    invite,
    delete,
    get,
    update_user,
    edit,
    removeProduct,
    getInvites,
)

urlpatterns = [
    path("create/", create),
    path("invite/", invite),
    path("delete/", delete),
    path("get/", get),
    path("update_user/", update_user),
    path("edit/", edit),
    path("remove_product/", removeProduct),
    path("get_invites/", getInvites),
]
