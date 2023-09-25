import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings
import requests
from io import BytesIO
import os
import uuid
from urllib.parse import urlparse, parse_qs, unquote
import mimetypes

bucket_name = settings.AWS_STORAGE_BUCKET_NAME
s3 = boto3.client(
    "s3",
    # region_name=settings.AWS_LOCATION,
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)
mimetypes.add_type("image/webp", ".webp")


def upload_to_spaces(url, folder_name, acl="public-read"):
    if not settings.DEBUG:
        try:
            try:
                response = requests.get(url)
            except:
                response = requests.get(url, verify=False)
            file = BytesIO(response.content)

            print("********", url)

            query_params = urlparse(url).query
            # Extract the image URL from the query parameters, if present
            image_url = parse_qs(query_params).get("url", [None])[0]
            if image_url:
                # If the image URL is present, decode it
                image_url = unquote(image_url)
            else:
                # If the image URL is not present, use the original URL
                image_url = url
            # Get the filename from the image URL
            filename = os.path.basename(urlparse(image_url).path)
            # If the filename has a query string or fragment identifier, remove it
            filename = filename.split("?")[0].split("#")[0]
            print(filename)

            # Get the file extension
            _, ext = os.path.splitext(filename)
            # Generate a random unique file name with the same extension
            filename = f"{uuid.uuid4()}{ext}"
            print("###", filename)
            mime_type, _ = mimetypes.guess_type(filename)
            print("@@@", mime_type)
            s3.upload_fileobj(
                file,
                folder_name,
                filename,
                ExtraArgs={
                    "ACL": acl,
                    "ContentType": mime_type,
                },
            )
        except FileNotFoundError:
            print("The file was not found")
            return False
        except NoCredentialsError:
            print("Credentials not available")
            return False
        return f"https://bucket.emall.space/{folder_name}/{filename}"
    else:
        return url
