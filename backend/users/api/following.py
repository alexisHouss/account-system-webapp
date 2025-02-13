from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from ..models.following import Following
from ..serializers.following_serializer import FollowingSerializer

User = get_user_model()


class FollowingViewSet(viewsets.ModelViewSet):
    serializer_class = FollowingSerializer
    permission_classes = [IsAuthenticated]
    queryset = Following.objects.all()

    def get_queryset(self):
        # For the 'accept' action, allow the target (followed user) to fetch the follow request.
        if self.action == "accept":
            return Following.objects.filter(following=self.request.user)

        # For the 'unfollow' action (and default list), allow the follower to access.
        return Following.objects.filter(followee=self.request.user)

    def create(self, request, *args, **kwargs):
        following_user_id = request.data.get("following")

        if not following_user_id:
            return Response(
                {"error": "The 'following' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            following_user = User.objects.get(pk=following_user_id)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        following = request.user.follow(following_user)
        serializer = self.get_serializer(following)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["GET"], url_path="followers")
    def followers(self, request):
        followers_qs = Following.objects.filter(following=request.user)
        serializer = self.get_serializer(followers_qs, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=["GET"], url_path="following")
    def following(self, request):
        following_qs = Following.objects.filter(followee=request.user)
        serializer = self.get_serializer(following_qs, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=["POST"], url_path="accept")
    def accept(self, request, pk=None):
        follow_request = self.get_object()

        if follow_request.following == request.user:
            follow_request.is_accepted = True
            follow_request.save()

            return Response(
                {"status": "Follow request accepted"}, status=status.HTTP_200_OK
            )

        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=["DELETE"], url_path="unfollow")
    def unfollow(self, request, pk=None):
        follow_request = self.get_object()

        if follow_request.followee == request.user:
            follow_request.delete()

            return Response({"status": "Unfollowed"}, status=status.HTTP_204_NO_CONTENT)

        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
