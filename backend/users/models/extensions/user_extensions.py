from django.contrib.auth import get_user_model
from users.models.following import Following

User = get_user_model()


def follow(self, other_user):
    if self == other_user:
        raise ValueError("Cannot follow yourself")

    # Is user private
    is_accepted = True

    if not other_user.profile.is_public:
        is_accepted = False

    following, created = Following.objects.get_or_create(
        followee=self, following=other_user, defaults={"is_accepted": is_accepted}
    )

    return following


def is_following(self, other_user):
    return Following.objects.filter(
        followee=self, following=other_user, is_accepted=True
    ).exists()


def is_followed_by(self, other_user):
    return Following.objects.filter(
        followee=other_user, following=self, is_accepted=True
    ).exists()


# Attach these methods to the User model
User.add_to_class("follow", follow)
User.add_to_class("is_following", is_following)
User.add_to_class("is_followed_by", is_followed_by)
