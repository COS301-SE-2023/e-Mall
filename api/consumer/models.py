from django.db import models

from user.models import User

# Create your models here.


def get_default_data():
    return {'data': ''}


class Consumer(User):

    type = models.CharField(max_length=8, default='consumer', editable=False)
    wishlist = models.JSONField(
        encoder=None, default=get_default_data, null=True, blank=True)

    class Meta:
        app_label = 'consumer'
