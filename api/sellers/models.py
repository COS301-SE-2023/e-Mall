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
    regNo = models.CharField(max_length=14, unique=True)
    businessName = models.CharField(max_length=30)
    businesCategory = models.CharField(
        max_length=6, choices=SELLER_CATEGORY_CHOICES)
    status = models.CharField(max_length=9, choices=SELLER_STATUS_CHOICES)
    isVerified = models.BooleanField
    website = models.URLField(max_length=200, unique=True)
    userId = models.ForeignKey(
        Users, verbose_name='owner', on_delete=models.CASCADE)
