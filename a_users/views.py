from django.contrib.auth.models import User
from .models import *
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import ProfileSerializer, UserSerializer
from .models import Profile
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from a_friends.models import FriendList , FriendRequest

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    @action(detail=False, methods=['put'], url_path='user/(?P<user_id>[^/.]+)')
    def update_profile_by_user(self, request, user_id=None):
        try:
            # Get the profile associated with the user ID
            profile = self.queryset.get(user=user_id)
        except Profile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # filtering users that are [not friends, not pending requests, not the current user]
    def list(self, request, *args, **kwargs):
        current_user = request.user
        friend_list = FriendList.objects.get(user=current_user)
        
        friend_ids = friend_list.friends.values_list('id', flat=True)
        sent_request_ids = FriendRequest.objects.filter(sender=current_user).values_list('receiver_id', flat=True)
        received_request_ids = FriendRequest.objects.filter(receiver=current_user).values_list('sender_id', flat=True)

        exclude_ids = list(friend_ids) + list(sent_request_ids) + list(received_request_ids) + [current_user.id]

        self.queryset = self.queryset.exclude(id__in=exclude_ids)
        
        return super().list(request, *args, **kwargs)