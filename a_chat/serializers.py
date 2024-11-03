from rest_framework import serializers
from .models import ZajelMessage, ZajelGroup


class ZajelMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZajelMessage
        # Or specify the fields you want to include in your API.
        fields = '__all__'
        # Make these fields read-only
        read_only_fields = ['group_name', 'author']


class ZajelGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZajelGroup
        # Or specify the fields you want to include in your API.
        fields = ['id', 'group_name', 'members', 'image', 'description']

        def create(self, validated_data):
            # remove members from validate data
            members_data = validated_data.pop('members', [])
            group = ZajelGroup.objects.create(**validated_data)

            # add members if validated
            group.members.set(members_data)
            return group
