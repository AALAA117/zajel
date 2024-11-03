from rest_framework import viewsets
from .models import ZajelGroup, ZajelMessage
from .serializers import ZajelGroupSerializer, ZajelMessageSerializer
from rest_framework import status
from rest_framework.response import Response
import pprint
import jwt
from django.db.models import Q


class ZajelGroupViewSet(viewsets.ModelViewSet):
    queryset = ZajelGroup.objects.filter()
    serializer_class = ZajelGroupSerializer

    def list(self, request, *args, **kwargs):

        user = request.user
        groups_this_user_is_in = ZajelGroup.objects.filter(members=user)
        self.queryset = groups_this_user_is_in

        # get the search query from the request
        search_query = request.query_params.get('query', None)

        if search_query:
            # filter groups based on search query
            groups_this_user_is_in = groups_this_user_is_in.filter(
                Q(group_name__icontains=search_query))

            self.queryset = groups_this_user_is_in

        return super().list(request, *args, **kwargs)


class ZajelMessageViewSet(viewsets.ModelViewSet):
    queryset = ZajelMessage.objects.all()
    serializer_class = ZajelMessageSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Retrieve the message instance
        instance = self.get_object()

        # Check if the user is the author of the message
        if instance.author != request.user:
            return Response(
                {"error": "You do not have permission to edit this message"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Proceed with the update if the user is the author
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class ZajelGroupMessagesViewSet(viewsets.ModelViewSet):
    serializer_class = ZajelMessageSerializer

    def get_queryset(self):
        group_id = self.kwargs.get("group_id")

        if group_id is not None and ZajelGroup.objects.filter(id=group_id).exists():
            messages = ZajelMessage.objects.filter(group_name_id=group_id)
            return messages

        return ZajelMessage.objects.none()

    def list(self, request, *args, **kwargs):
        group_id = self.kwargs.get("group_id")

        # Check if the group exists
        if not ZajelGroup.objects.filter(id=group_id).exists():
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Call the superclass's list method to return the filtered messages
        return super().list(request, *args, **kwargs)
