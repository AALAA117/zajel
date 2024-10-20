from rest_framework import serializers
from .models import FriendList, FriendRequest


class FriendListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendList
        fields = '__all__'  # Or specify the fields you want to include in your API.


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = '__all__'  # Or specify the fields you want to include in your API.
        read_only_fields = ['is_active', 'sender']
