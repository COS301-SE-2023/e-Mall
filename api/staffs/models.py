from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from .managers import StaffsManager

STAFF_ROLE_CHOICES = (
    ('ADMIN', 'admin'),
    ('STAFF', 'staff'),
    ('SUPERUSER', 'superuser'),
)
# method for updating


class Staffs(AbstractBaseUser, PermissionsMixin):
    # id = models.AutoField(primary_key=True)
    fname = models.CharField(max_length=15)
    sname = models.CharField(max_length=15)
    password = models.CharField(_("password"), max_length=128)
    email = models.EmailField(_("email address"), unique=True)
    role = models.CharField(
        max_length=9, choices=STAFF_ROLE_CHOICES, default='STAFF')
    created_at = models.DateTimeField(_('created at'), default=timezone.now)
    last_login = models.DateTimeField(_("last login"), blank=True, null=True)
    is_staff = models.BooleanField(default=False, help_text=_(
        'Designates whether the user can log into this admin site.'))
    is_active = models.BooleanField(_('active'), default=False,
                                    help_text=_('Designates whether this user should be treated as '
                                                'active. Unselect this instead of deleting accounts.'))
    is_superuser = models.BooleanField(_('superuser'), default=False)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    username = None
    objects = StaffsManager()

    def __str__(self):
        return self.email
