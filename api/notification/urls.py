from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.send_message_api, name="create"),
    path("delete/", views.delete, name="delete"),
    path("delete/all/", views.delete_all, name="delete_all"),
    path("read/", views.read, name="read"),
    path("read/all/", views.read_all, name="read_all"),
    path("get/", views.get, name="get"),
    path("device/", views.update_device_token, name="device"),
    path("count/unread/", views.count_unread_notifications, name="unread"),
    path("settings/update/", views.update_settings, name="update_settings"),
    path("settings/get/", views.get_settings, name="get_settings"),
]
