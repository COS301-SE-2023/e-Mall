from django.urls import path
from .views import (
    create,
    update,
    delete,
    get,
    update_user,
    edit,
    removeProduct,
    getInvites,
)

urlpatterns = [
    path("create/", create),
    path("update/", update),
    path("delete/", delete),
    path("get/", get),
    path("update_user/", update_user),
    path("edit/", edit),
    path("remove_product/", removeProduct),
    path("get_invites/", getInvites),
]
