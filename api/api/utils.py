import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings
import requests
from io import BytesIO

bucket_name = settings.AWS_STORAGE_BUCKET_NAME
s3 = boto3.client(
    "s3",
    region_name=settings.AWS_LOCATION,
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)


def upload_to_spaces(url, folder_name, acl="public-read"):
    try:
        response = requests.get(url)
        file = BytesIO(response.content)
        file.name = url.split("/")[-1]  # Use the last part of the URL as the file name

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
