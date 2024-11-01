from django.urls import path, include
from a_users.views import *
from rest_framework.routers import DefaultRouter
from dj_rest_auth.views import (
    LoginView, LogoutView, PasswordChangeView, PasswordResetConfirmView,
    PasswordResetView, UserDetailsView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from dj_rest_auth.registration.views import RegisterView

app_name = 'a_users'

router = DefaultRouter()
router.register(r'profile', ProfileViewSet, basename='profile')
router.register(r'user', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('user/', UserDetailsView.as_view(), name='user'),
    path('token/', TokenObtainPairView.as_view(), name='token-obtain-view'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
