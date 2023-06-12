from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Seller


@receiver(pre_save, sender=Seller)
def set_business_category(sender, instance, **kwargs):
    print('passing here')
    # print(instance.no_em)
    # if (instance.business_category is None):
    if instance.no_employees <= 10:
        instance.business_category = 'MICRO'
    elif instance.no_employees <= 50:
        instance.business_category = 'SMALL'
    elif instance.no_employees <= 250:
        instance.business_category = 'MEDIUM'
    else:
        instance.business_category = 'NONE'


pre_save.connect(set_business_category, sender=Seller)
