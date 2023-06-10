import boto3
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from django.apps import apps


class CognitoAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.META.get('HTTP_AUTHORIZATION', '')
        if (header is None or not header.strip()):
            return None
        access_token = header.split(' ')[1]
        try:
            cognito = boto3.client(
                'cognito-idp', region_name=settings.COGNITO_CONFIG['region'])
            response = cognito.get_user(AccessToken=access_token)
            email = None
            user_type = None
            for attribute in response['UserAttributes']:
                if attribute['Name'] == 'email':
                    email = attribute['Value']
                elif attribute['Name'] == 'custom:type':
                    user_type = attribute['Value']

            if email is None or email != request.data.get('email'):
                raise AuthenticationFailed('Invalid email')
            if user_type is None:
                raise AuthenticationFailed('Invalid user type')
            model = apps.get_model(app_label=user_type,
                                   model_name=user_type.capitalize())
            user = model.objects.filter(email=email).first()
            if user:
                user.is_authenticated = True
                return (user, None)

        except Exception as e:
            raise AuthenticationFailed('Invalid access token')

    def authenticate_header(self, request):
        return 'Bearer'
