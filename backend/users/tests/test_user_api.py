import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


# --- Tests for UserViewSet (User creation) --- #


@pytest.mark.django_db
def test_user_creation(api_client):
    """
    Test that a new user can be created via the UserViewSet.
    (Assumes router registration with basename "users".)
    """
    url = reverse("users-list")  # e.g. "/users/"
    data = {
        "username": "newuser",
        "password": "testpassword",
        "email": "newuser@example.com",
    }
    response = api_client.post(url, data)
    assert response.status_code == 201, response.data
    assert response.data["username"] == "newuser"


# --- Tests for UserProfileViewSet --- #


@pytest.mark.django_db
def test_get_own_profile(api_client, user):
    """
    Test that a user can retrieve their own profile with full details.
    (Assumes router registration with basename "profiles" and lookup_field="username".)
    """
    url = reverse("profiles-detail", kwargs={"username": user.username})

    api_client.force_authenticate(user=user)
    response = api_client.get(url)

    assert response.status_code == 200
    # Full serializer is expected, so the response should include detailed fields.
    assert response.data["username"] == user.username


@pytest.mark.django_db
def test_get_public_profile(api_client, user, user_factory):
    """
    Test that a user can retrieve another user's public profile.
    """
    other = user_factory.create()
    # Mark the other user's profile as public.
    other.profile.is_public = True
    other.profile.save()

    url = reverse("profiles-detail", kwargs={"username": other.username})
    api_client.force_authenticate(user=user)
    response = api_client.get(url)

    assert response.status_code == 200
    # Expect full details (full serializer).
    assert response.data["username"] == other.username
    assert "user" in response.data  # assuming full details include a 'user' field


@pytest.mark.django_db
def test_get_private_profile_without_friendship(api_client, user, user_factory):
    """
    Test that if a user tries to access a private profile without an accepted follow,
    the permission is denied (403 Forbidden).
    """
    private_user = user_factory.create()
    private_user.profile.is_public = False
    private_user.profile.save()

    url = reverse("profiles-detail", kwargs={"username": private_user.username})
    api_client.force_authenticate(user=user)
    response = api_client.get(url)
    # The custom AreFriends permission should prevent access.
    assert response.status_code == 403


@pytest.mark.django_db
def test_get_private_profile_when_friends(api_client, user, user_factory):
    """
    Test that if a user is "friends" (has an accepted follow relationship)
    with a private user, then the full profile is returned.
    """
    private_user = user_factory.create()
    private_user.profile.is_public = False
    private_user.profile.save()

    # Create a following relationship from user to private_user.
    follow = user.follow(private_user)
    follow.is_accepted = True
    follow.save()

    url = reverse("profiles-detail", kwargs={"username": private_user.username})
    api_client.force_authenticate(user=user)
    response = api_client.get(url)
    assert response.status_code == 200
    # Full details should now be available.
    assert response.data["username"] == private_user.username
    assert "user" in response.data


@pytest.mark.django_db
def test_search_users_success(api_client, user, user_factory):
    """
    Test that the search endpoint returns profiles matching the query.
    (Assumes the custom action is registered with the method name `search_users`.)
    """
    # Create two users with known usernames.
    user1 = user_factory.create(username="alice")
    user1.profile.is_public = True
    user1.profile.save()

    user2 = user_factory.create(username="bob")
    user2.profile.is_public = True
    user2.profile.save()

    # The reverse name is based on the viewset's basename ("profiles") and the action method name.
    url = reverse("profiles-search")
    api_client.force_authenticate(user=user)
    response = api_client.get(url, {"username": "ali"})
    assert response.status_code == 200
    # We expect at least one result (for "alice").
    usernames = [profile["username"] for profile in response.data]
    assert any("alice" in uname for uname in usernames)


@pytest.mark.django_db
def test_search_users_missing_parameter(api_client, user):
    """
    Test that calling the search endpoint without a username parameter returns a 400 error.
    """
    url = reverse("profiles-search")
    api_client.force_authenticate(user=user)
    response = api_client.get(url)

    assert response.status_code == 400
    assert "error" in response.data
