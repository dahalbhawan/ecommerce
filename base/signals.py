from django.db.models.signals import pre_save
from django.contrib.auth.models import User

def updateUsername(sender, instance, **kwargs):
    if instance.email != '':
        instance.username= instance.email

pre_save.connect(sender=User, receiver=updateUsername)