# chat/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'friends'

router = DefaultRouter()
# router.register(r'friends', views.FriendListViewSet, basename='friends')
router.register(r'friends_requests', views.FriendRequestViewSet,
                basename='friends_requests')

urlpatterns = [
    path("api/", include(router.urls)),
    path('requests/', views.list_all_incoming_requests, name='listRequests'),
    path('out/', views.list_all_outgoing_requests, name='listOutGoingRequests'),
    path('accept/<int:user_id>/', views.accept_request, name='accept'),
    path('decline/<int:sender_id>/', views.decline_request, name='decline'),
    path('cancel/<int:receiver_id>/', views.cancel_request, name='cancel'),
    path('unfriend/<int:user_id>/', views.unfriend, name='unfriend'),
    path('list/', views.freinds_list, name='friends_list'),
]
