import pytest
from django.contrib.auth import get_user_model
from ..models.profile import UserProfile

User = get_user_model()


@pytest.mark.django_db
def test_user_and_profile_creation(user):
    assert isinstance(user, User)
    assert user.profile is not None
    assert isinstance(user.profile, UserProfile)


@pytest.mark.django_db
def test_following(user, user_factory):
    # Create a private user
    user2 = user_factory.create()

    # Check private user can follow public one
    user.follow(user2)
    assert user.is_following(user2)
    assert user2.is_followed_by(user)

    assert not user2.is_following(user)
    assert not user.is_followed_by(user2)


@pytest.mark.django_db
def test_following_private(user, user_factory):
    # Create a private user
    user2 = user_factory.create()
    user2.profile.is_public = False
    user2.profile.save()

    # Check private user cannot follow private one
    following = user.follow(user2)
    assert not user.is_following(user2)
    assert not user2.is_followed_by(user)

    assert following.is_accepted is False

    # Now private user accepts the follow request
    following.is_accepted = True
    following.save()

    assert user.is_following(user2)
    assert user2.is_followed_by(user)
