from drf_yasg import openapi

target_param = openapi.Parameter(
    "target",
    openapi.IN_QUERY,
    description="The target user ID",
    type=openapi.TYPE_STRING,
    required=True,
)
message_type_param = openapi.Parameter(
    "message_type",
    openapi.IN_QUERY,
    description="The type of message to be sent [user, query, wishlist, follower]",
    type=openapi.TYPE_STRING,
    required=True,
)
image_param = openapi.Parameter(
    "image",
    openapi.IN_QUERY,
    description="The image link associated with the message",
    type=openapi.TYPE_STRING,
    required=False,
)
message_param = openapi.Parameter(
    "message",
    openapi.IN_QUERY,
    description="The message to be sent",
    type=openapi.TYPE_STRING,
    required=True,
)
title_param = openapi.Parameter(
    "title",
    openapi.IN_QUERY,
    description="The title of the message",
    type=openapi.TYPE_STRING,
    required=False,
)

notification_id_param = openapi.Parameter(
    "notification_id",
    openapi.IN_QUERY,
    description="The ID of the notification",
    type=openapi.TYPE_STRING,
    required=True,
)
optional_notification_id_param = openapi.Parameter(
    "notification_id",
    openapi.IN_QUERY,
    description="The ID of last notification that was sent previously",
    type=openapi.TYPE_STRING,
)

device_token_param = openapi.Parameter(
    "device_token",
    openapi.IN_QUERY,
    description="The device token of user for FCM",
    type=openapi.TYPE_STRING,
    required=True,
)

device_token_param = openapi.Parameter(
    "device_token",
    openapi.IN_QUERY,
    description="The device token of user for FCM",
    type=openapi.TYPE_STRING,
    required=True,
)

general_param = openapi.Parameter(
    "general",
    openapi.IN_QUERY,
    description="General notifications setting",
    type=openapi.TYPE_BOOLEAN,
    required=False,
)
following_param = openapi.Parameter(
    "following",
    openapi.IN_QUERY,
    description="Following notifications setting",
    type=openapi.TYPE_BOOLEAN,
    required=False,
)
wishlist_param = openapi.Parameter(
    "wishlist",
    openapi.IN_QUERY,
    description="Wishlist notifications setting",
    type=openapi.TYPE_BOOLEAN,
    required=False,
)
all_param = openapi.Parameter(
    "all",
    openapi.IN_QUERY,
    description="All notifications setting",
    type=openapi.TYPE_BOOLEAN,
    required=False,
)
