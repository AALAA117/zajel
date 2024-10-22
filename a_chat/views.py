from rest_framework import viewsets
from .models import ZajelGroup, ZajelMessage
from .serializers import ZajelGroupSerializer, ZajelMessageSerializer


class ZajelGroupViewSet(viewsets.ModelViewSet):
    queryset = ZajelGroup.objects.filter()
    serializer_class = ZajelGroupSerializer

    def list(self, request, *args, **kwargs):
        user = self.request.user
        # Filter groups where the user is a member
        groups_this_user_is_in = ZajelGroup.objects.filter(members=user)

        # Debug print to see the groups
        print(groups_this_user_is_in)

        # Update the queryset to only include these groups
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
