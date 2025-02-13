from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Following(models.Model):
    followee = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followees"
    )
    following = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers"
    )

    is_accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ["followee", "following"]

    def __str__(self):
        return f"{self.followee.username} follows {self.following.username}"
