from django.contrib.auth import get_user_model
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.decorators import action
from ..models.profile import UserProfile
from ..models.following import Following

from ..serializers.user_serializer import (
    UserSerializer,
    UserProfileSerializer,
    LimitedUserProfileSerializer,
)


User = get_user_model()


class UserViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class AreFriends(BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            obj.user == request.user
            or obj.is_public
            or Following.objects.filter(
                followee=request.user, following=obj.user, is_accepted=True
            ).exists()
        )


class UserProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserProfile.objects.all()
    permission_classes = [IsAuthenticated, AreFriends]
    lookup_field = "username"

    def get_object(self):
        # Look up the object by the related User's username.
        username = self.kwargs[self.lookup_field]
        obj = self.get_queryset().get(user__username=username)
        self.check_object_permissions(self.request, obj)

        return obj

    def get_serializer_class(self):
        # If there's no lookup value in kwargs (i.e. we're not in a detail route)
        # then simply return the full serializer.
        if self.lookup_field not in self.kwargs:
            return UserProfileSerializer

        # We're in a detail view, so decide based on permission.
        obj = self.get_object()

        if (
            obj.user != self.request.user
            and not obj.is_public
            and not Following.objects.filter(
                followee=self.request.user, following=obj.user, is_accepted=True
            ).exists()
        ):
            return LimitedUserProfileSerializer

        return UserProfileSerializer

    @action(detail=False, methods=["GET"], url_path="search", url_name="search")
    def search_users(self, request):
        username = request.query_params.get("username", None)

        if username:
            # Filter on the related User model's username field.
            users = UserProfile.objects.filter(user__username__icontains=username)
            serializer = self.get_serializer(users, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            {"error": "Username parameter is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
