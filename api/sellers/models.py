from django.db import models

from users.models import Users

# Create your models here.
SELLER_STATUS_CHOICES = (
    ('PENDING', 'pending'),
    ('ACTIVE', 'active'),
    ('SUSPENDED', 'suspended'),
)
SELLER_CATEGORY_CHOICES = (
    ('MICRO', 'micro'),
    ('SMALL', 'small'),
    ('MEDIUM', 'medium'),
)


class Sellers(models.Model):
    reg_no = models.CharField(max_length=14, unique=True)
    business_name = models.CharField(max_length=30)
    business_type = models.CharField(max_length=100)
    catalogue_size = models.IntegerField(default=0)
    busines_category = models.CharField(
        max_length=6, choices=SELLER_CATEGORY_CHOICES)
    status = models.CharField(max_length=9, choices=SELLER_STATUS_CHOICES)
    is_verified = models.BooleanField
    website = models.URLField(max_length=200, unique=True)
    user_id = models.ForeignKey(
        Users, verbose_name='owner', on_delete=models.CASCADE)
