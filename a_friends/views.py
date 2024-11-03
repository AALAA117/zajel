from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .models import FriendList, FriendRequest
from .serializers import FriendRequestSerializer, FriendListSerializer


# ViewSet for Friend Requests
class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer

    def perform_create(self, serializer):
        sender = self.request.user
        if not sender.is_authenticated:
            raise ValidationError(
                {"error": "Authentication required"}, code=status.HTTP_401_UNAUTHORIZED)
        serializer.save(sender=sender)


@api_view(['GET'])
def freinds_list(request):
    user = request.user
    f_list = FriendList.objects.filter(user=user)
    serialize = FriendListSerializer(f_list, many=True)
    return Response(serialize.data, status=status.HTTP_200_OK)


# Helper function to find active friend request
def get_active_friend_request(sender, receiver):
    return get_object_or_404(FriendRequest, sender=sender, receiver=receiver)


# API Views

@api_view(['POST'])
def accept_request(request, *args, **kwargs):
    sender_id = kwargs.get('user_id')
    receiver = request.user
    friend_request = get_active_friend_request(
        sender=sender_id, receiver=receiver)
    friend_request.accept()
    return Response({"accepted": f"You have accepted the friend request from {friend_request.sender.username}"})


@api_view(['POST'])
def decline_request(request, *args, **kwargs):
    print("/n request", request)
    sender_id = kwargs.get('sender_id')
    receiver = request.user
    friend_request = get_active_friend_request(
        sender=sender_id, receiver=receiver)
    friend_request.decline()
    return Response({"declined": f"You have declined the friend request from {friend_request.sender.username}"})


@api_view(['POST'])
def cancel_request(request, *args, **kwargs):
    receiver_id = kwargs.get('receiver_id')
    sender = request.user
    friend_request = get_active_friend_request(
        sender=sender, receiver=receiver_id)
    friend_request.cancel()
    return Response({"cancelled": f"You have cancelled the friend request to {friend_request.receiver.username}"})


@api_view(['POST'])
def unfriend(request, *args, **kwargs):
    user = request.user
    deletee_id = kwargs.get('user_id')
    deletee = get_object_or_404(User, id=deletee_id)
    user_friend_list = get_object_or_404(FriendList, user=user)
    user_friend_list.unfriend(deletee)

    return Response({"deleted": f"You have unfriended {deletee.username} successfully"})


@api_view(['GET'])
def list_all_incoming_requests(request):
    user = request.user
    incoming_requests = FriendRequest.objects.filter(receiver=user)
    serializer = FriendRequestSerializer(incoming_requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@login_required
@api_view(['GET'])
def list_all_outgoing_requests(request):
    user = request.user
    outgoing_requests = FriendRequest.objects.filter(sender=user)
    serializer = FriendRequestSerializer(outgoing_requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
