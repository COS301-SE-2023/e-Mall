from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

target_param = openapi.Parameter(
    "target",
    openapi.IN_QUERY,
    description="The target user ID",
    type=openapi.TYPE_STRING,
)
message_type_param = openapi.Parameter(
    "message_type",
    openapi.IN_QUERY,
    description="The type of message to be sent",
    type=openapi.TYPE_STRING,
)
image_param = openapi.Parameter(
    "image",
    openapi.IN_QUERY,
    description="The image associated with the message",
    type=openapi.TYPE_STRING,
    required=False,
)
message_param = openapi.Parameter(
    "message",
    openapi.IN_QUERY,
    description="The message to be sent",
    type=openapi.TYPE_STRING,
    required=False,
)
title_param = openapi.Parameter(
    "title",
    openapi.IN_QUERY,
    description="The title of the message",
    type=openapi.TYPE_STRING,
    required=False,
)

send_message_api_decorator = swagger_auto_schema(
    method="post",
    manual_parameters=[
        target_param,
        message_type_param,
        image_param,
        message_param,
        title_param,
    ],
)

notification_id_param = openapi.Parameter(
    "notification_id",
    openapi.IN_QUERY,
    description="The ID of the notification to delete or mark as read",
    type=openapi.TYPE_STRING,
)

delete_decorator = swagger_auto_schema(
    method="post", manual_parameters=[notification_id_param]
)

read_decorator = swagger_auto_schema(
    method="post", manual_parameters=[notification_id_param]
)

get_decorator = swagger_auto_schema(
    method="post", manual_parameters=[notification_id_param]
)
