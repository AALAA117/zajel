from rest_framework import serializers
from .models import FriendList, FriendRequest
from a_users.serializers import UserSerializer 
class FriendListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendList
        fields = '__all__'  # Or specify the fields you want to include in your API.


class FriendRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    class Meta:
        model = FriendRequest
        fields = ['id', 'sender']
