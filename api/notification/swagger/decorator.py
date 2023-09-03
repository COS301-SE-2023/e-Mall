from drf_yasg.utils import swagger_auto_schema
from .parameter import *
from .response import *

send_message_api_decorator = swagger_auto_schema(
    operation_id="send message",
    description="Creating a document in noticiation db. Then cloud function is triggered and send message target user specified",
    method="post",
    manual_parameters=[
        target_param,
        message_type_param,
        image_param,
        message_param,
        title_param,
    ],
    responses=send_message_response,
)

delete_decorator = swagger_auto_schema(
    operation_id="delete",
    description="Delete notification document specified by notification id",
    method="post",
    manual_parameters=[notification_id_param],
    responses=delete_response,
)
delete_all_decorator = swagger_auto_schema(
    operation_id="delete all",
    description="delete all notification for current user",
    method="post",
    responses=delete_all_response,
)

read_decorator = swagger_auto_schema(
    operation_id="read",
    description="Mark a notification specified by notification id as read",
    method="post",
    manual_parameters=[notification_id_param],
    responses=read_response,
)
read_all_decorator = swagger_auto_schema(
    operation_id="read all",
    description="Mark all notifications as read",
    method="post",
    responses=read_all_response,
)
get_decorator = swagger_auto_schema(
    operation_id="get",
    description="Get notifications in paginated way. If notification id is provided, it returns a list after that specified notification",
    method="post",
    manual_parameters=[optional_notification_id_param],
    responses=get_response,
)
update_device_token_decorator = swagger_auto_schema(
    operation_id="update device",
    description="Update current user's device token, which is used for sending notifications",
    method="post",
    manual_parameters=[device_token_param],
    responses=update_settings_response,
)
update_settings_decorator = swagger_auto_schema(
    operation_id="update settings",
    description="Update notification settings for current user. if no argument is provided, all settings set to true",
    method="post",
    manual_parameters=[general_param, following_param, wishlist_param, all_param],
    responses=update_settings_response,
)
count_unread_notifications_decorator = swagger_auto_schema(
    operation_id="get unread count",
    description="get unread notification counts",
    method="post",
    responses=count_unread_notifications_response,
)
