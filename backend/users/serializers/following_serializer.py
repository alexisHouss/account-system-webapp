from django.contrib.auth import get_user_model
from rest_framework import serializers
from ..models.following import Following

User = get_user_model()


class FollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Following
        fields = ("id", "followee", "following", "is_accepted")
        read_only_fields = ("is_accepted",)
