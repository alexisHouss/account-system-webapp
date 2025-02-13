from django.contrib.auth import get_user_model
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models.profile import UserProfile

User = get_user_model()


# Signals for auto-creating/deleting user profile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_delete, sender=User)
def delete_user_profile(sender, instance, **kwargs):
    instance.userprofile.delete()
