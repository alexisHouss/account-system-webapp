import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from users.models.following import Following

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(user, api_client):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.mark.django_db
def test_create_follow_request_public(authenticated_client, user, user_factory):
    """
    When a user follows a public user, the follow request should be auto-accepted.
    """
    # Create a public user to be followed.
    public_user = user_factory.create()
    public_user.profile.is_public = True
    public_user.profile.save()

    url = reverse("follow-list")  # Using the registered basename "follow"
    data = {"following": public_user.pk}

    response = authenticated_client.post(url, data)
    assert response.status_code == 201

    follow_id = response.data["id"]
    follow = Following.objects.get(pk=follow_id)
    assert follow.is_accepted is True
    assert follow.followee == user
    assert follow.following == public_user


@pytest.mark.django_db
def test_create_follow_request_private(authenticated_client, user, user_factory):
    """
    When a user follows a private user, the follow request should not be auto-accepted.
    """
    private_user = user_factory.create()
    private_user.profile.is_public = False
    private_user.profile.save()

    url = reverse("follow-list")
    data = {"following": private_user.pk}

    response = authenticated_client.post(url, data)
    assert response.status_code == 201

    follow = Following.objects.get(pk=response.data["id"])
    assert follow.is_accepted is False


@pytest.mark.django_db
def test_list_followers(user_factory):
    """
    Test that the 'followers' endpoint returns the correct follow relationships.
    """
    # Create two users: user1 follows user2.
    user1 = user_factory.create()
    user2 = user_factory.create()
    follow = user1.follow(user2)

    client = APIClient()
    client.force_authenticate(user=user2)
    url = reverse("follow-followers")  # Note the updated reverse name.
    response = client.get(url)
    assert response.status_code == 200
    # We expect one follower record.
    assert len(response.data) == 1
    # Check that the returned record has the expected follower.
    assert response.data[0]["followee"] == user1.pk


@pytest.mark.django_db
def test_list_following(user_factory):
    """
    Test that the default list endpoint returns followings initiated by the current user.
    """
    # Create two users: user1 follows user2.
    user1 = user_factory.create()
    user2 = user_factory.create()
    follow = user1.follow(user2)

    client = APIClient()
    client.force_authenticate(user=user1)
    url = reverse("follow-list")
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["following"] == user2.pk


@pytest.mark.django_db
def test_accept_follow(user_factory):
    """
    Test that a user can accept a pending follow request.
    """
    # Create two users: user1 follows user2 (with user2 being private).
    user1 = user_factory.create()
    user2 = user_factory.create()
    user2.profile.is_public = False
    user2.profile.save()

    follow = user1.follow(user2)
    assert follow.is_accepted is False

    client = APIClient()
    client.force_authenticate(user=user2)
    url = reverse("follow-accept", args=[follow.pk])

    response = client.post(url)
    assert response.status_code == 200

    follow.refresh_from_db()
    assert follow.is_accepted is True


@pytest.mark.django_db
def test_unfollow(user_factory):
    """
    Test that a user can unfollow another user.
    """
    # Create two users: user1 follows user2.
    user1 = user_factory.create()
    user2 = user_factory.create()
    follow = user1.follow(user2)

    client = APIClient()
    client.force_authenticate(user=user1)
    url = reverse("follow-unfollow", args=[follow.pk])
    response = client.delete(url)
    assert response.status_code == 204

    # Confirm that the follow relationship no longer exists.
    with pytest.raises(Following.DoesNotExist):
        Following.objects.get(pk=follow.pk)
