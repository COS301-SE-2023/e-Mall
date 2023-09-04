from drf_yasg import openapi

send_message_response = {
    "200": openapi.Response(
        description="Successful Message Sent",
        examples={
            "application/json": {
                "status": "success",
            }
        },
    ),
    "400": openapi.Response(
        description="Error Message",
        examples={
            "application/json": {"status": "error", "message": "Invalid parameter"}
        },
    ),
}
delete_response = {
    "200": openapi.Response(
        description="Successful Deletion",
        examples={
            "application/json": {
                "status": "success",
            }
        },
    ),
    "400": openapi.Response(
        description="Error Message",
        examples={
            "application/json": {"status": "error", "message": "Invalid parameter"}
        },
    ),
}

delete_all_response = {
    "200": openapi.Response(
        description="Successful Deletion of All Messages",
        examples={
            "application/json": {
                "status": "success",
            }
        },
    ),
    "400": openapi.Response(
        description="Error Message",
        examples={
            "application/json": {"status": "error", "message": "Invalid parameter"}
        },
    ),
}
get_response = {
    "200": openapi.Response(
        description="Successful Retrieval of Notifications",
        examples={
            "application/json": {
                "has_next": True,
                "notifications": [
                    {
                        "id": "notification_id_1",
                        "image": "https://image_url_1.jpg",
                        "is_read": False,
                        "message": "message_1",
                        "message_type": "wishlist",
                        "timestamp": "2023-09-03T14:43:01.450000Z",
                        "title": "title_1",
                    },
                    {
                        "id": "notification_id_2",
                        "image": "https://image_url_2.jpg",
                        "is_read": True,
                        "message": "message_2",
                        "message_type": "user",
                        "timestamp": "2023-09-02T23:45:02.791000Z",
                        "title": "title_2",
                    },
                ],
            }
        },
    ),
    "400": openapi.Response(
        description="Error Message",
        examples={
            "application/json": {"status": "error", "message": "Invalid parameter"}
        },
    ),
}

read_response = {
    "200": openapi.Response(
        description="Successful Marking of Notification as Read",
        examples={
            "application/json": {
                "status": "success",
            }
        },
    ),
    "400": openapi.Response(
        description="Error Message",
        examples={
            "application/json": {"status": "error", "message": "Invalid parameter"}
        },
    ),
}

read_all_response = {
    "200": openapi.Response(
        description="Successful Marking of All Notifications as Read",
        examples={
            "application/json": {
                "status": "success",
            }
        },
    ),
    "400": openapi.Response(
        description="Error Message",
        examples={
            "application/json": {"status": "error", "message": "Invalid parameter"}
        },
    ),
}
update_device_token_response = {
    "200": openapi.Response(
        description="Successful Update of Device Token",
        examples={
            "application/json": {
                "status": "success",
                "message": "Device token updated successfully",
            }
        },
    ),
    "400": openapi.Response(
        description="Error Message",
        examples={
            "application/json": {"status": "error", "message": "Invalid parameter"}
        },
    ),
}
update_settings_response = {
    "200": openapi.Response(
        description="Successful Update of Settings",
        examples={
            "application/json": {
                "status": "success",
                "message": "Settings updated successfully",
            }
        },
    ),
    "400": openapi.Response(
        description="Error Message",
        examples={
            "application/json": {"status": "error", "message": "Invalid field or value"}
        },
    ),
}
count_unread_notifications_response = {
    "200": openapi.Response(
        description="Successful Retrieval of Unread Notifications Count",
        examples={
            "application/json": {
                "status": "success",
                "unread_count": 3,
            }
        },
    ),
    "400": openapi.Response(
        description="Error Message",
        examples={
            "application/json": {"status": "error", "message": "Invalid parameter"}
        },
    ),
}
