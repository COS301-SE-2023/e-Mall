import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings
import requests
from io import BytesIO
import os
import uuid
from urllib.parse import urlparse

bucket_name = settings.AWS_STORAGE_BUCKET_NAME
s3 = boto3.client(
    "s3",
    # region_name=settings.AWS_LOCATION,
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)


def upload_to_spaces(url, folder_name, acl="public-read"):
    if not settings.DEBUG:
        try:
            response = requests.get(url)
            file = BytesIO(response.content)
            # Parse the URL and get only the path component
            url_path = urlparse(url).path
            # Get the extension of the file
            _, ext = os.path.splitext(url_path)
            # Generate a random unique file name with the same extension
            file.name = f"{uuid.uuid4()}{ext}"

            s3.upload_fileobj(
                file,
                folder_name,
                file.name,
                ExtraArgs={
                    "ACL": acl,
                },
            )

        except FileNotFoundError:
            print("The file was not found")
            return False
        except NoCredentialsError:
            print("Credentials not available")
            return False
        return f"https://{bucket_name}.ams3.cdn.digitaloceanspaces.com/{folder_name}/{file.name}"

    else:
        return url
