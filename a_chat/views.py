from rest_framework import viewsets
from .models import ZajelGroup
from .serializers import  ZajelGroupSerializer

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
