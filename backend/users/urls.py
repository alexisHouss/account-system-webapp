from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api.user import UserViewSet, UserProfileViewSet
from .api.following import FollowingViewSet


router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")
router.register(r"profiles", UserProfileViewSet, basename="profiles")
router.register(r"follow", FollowingViewSet, basename="follow")

urlpatterns = [
    path("", include(router.urls)),
]
