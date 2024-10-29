from rest_framework import serializers
from .models import ZajelMessage, ZajelGroup

class ZajelMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZajelMessage
        fields = '__all__'  # Or specify the fields you want to include in your API.
        read_only_fields = ['group_name', 'author']  # Make these fields read-only


class ZajelGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZajelGroup
        fields = '__all__'  # Or specify the fields you want to include in your API.
        read_only_fields = ['members']


