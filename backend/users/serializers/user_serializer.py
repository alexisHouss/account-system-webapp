from django.contrib.auth import get_user_model
from rest_framework import serializers
from ..models.profile import UserProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    number_of_followers = serializers.ReadOnlyField()
    number_of_followees = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = (
            "id",
            "user",
            "username",
            "bio",
            "is_public",
            "number_of_followers",
            "number_of_followees",
        )
        read_only_fields = ("user",)


class LimitedUserProfileSerializer(serializers.ModelSerializer):
    number_of_followers = serializers.ReadOnlyField()
    number_of_followees = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = ("id", "username", "number_of_followers", "number_of_followees")
