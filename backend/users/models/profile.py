from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True)
    is_public = models.BooleanField(default=True)

    @property
    def username(self):
        return self.user.username

    @property
    def number_of_followers(self):
        return self.user.followers.count()

    @property
    def number_of_followees(self):
        return self.user.followees.count()

    def __str__(self):
        return f"{self.user.username} Profile"
