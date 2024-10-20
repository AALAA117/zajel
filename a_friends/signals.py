from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from .models import FriendList


@receiver(post_save, sender=User)
def user_post_save(sender, instance, created, **kwargs):
    if created:
        create_friend_list(instance)


def create_friend_list(user):
    """Create a FriendList for the new user."""
    try:
        FriendList.objects.create(user=user)
        print(f"Friend list created for user: {user.username}")
    except Exception as e:
        print(f"Error creating friend list for user {user.username}: {e}")
