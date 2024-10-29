# chat/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = "chat"  # Add this line

router = DefaultRouter()
router.register(r"messages", views.ZajelMessageViewSet, basename="messages")
router.register(r"groups", views.ZajelGroupViewSet, basename="groups")
# router.register(r"groupMessages", views.ZajelGroupMessagesViewSet, basename='groupMessages')

urlpatterns = [
    path("api/", include(router.urls)),
    path(
        "api/groupMessages/<int:group_id>/",
        views.ZajelGroupMessagesViewSet.as_view({"get": "list"}),
        name="group-messages-list",
    ),
]
