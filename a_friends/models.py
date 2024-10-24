from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from rest_framework import status


# Create your models here.

class FriendList(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user"
    )

    friends = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="friends"
    )

    def __str__(self):
        return self.user.username

    def add_friend(self, acc):
        if acc != self.user and acc not in self.friends.all():
            self.friends.add(acc)
            return True
        return False

    def remove_friend(self, acc):
        if acc in self.friends.all():
            self.friends.remove(acc)
            return True
        return False

    def unfriend(self, removee):
        self.remove_friend(removee)
        removee_friend_list = FriendList.objects.get(user=removee)
        removee_friend_list.remove_friend(self.user)

    def is_friend(self, acc):
        return True if acc in self.friends.all() else False

    def is_mutual_friend(self, acc):
        if self.is_friend(acc):
            return "he is already a friend"

        for friend in self.friends.all():
            friend_list_of_afriend = FriendList.objects.get(user=friend)
            if friend_list_of_afriend.is_friend(acc):
                return True

        return False


class FriendRequest(models.Model):
    # setting.AUTH_USER_MODEL
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="sender", on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="receiver", on_delete=models.CASCADE
    )
    # get the timestamp of the friend request
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sender.username

    def accept(self):
        receiver_friend_list = FriendList.objects.get(user=self.receiver)
        sender_friend_list = FriendList.objects.get(user=self.sender)

        receiver_friend_list.add_friend(self.sender)
        sender_friend_list.add_friend(self.receiver)

        self.save()

    # # the receiver declined the friend request
    def decline(self):
        self.delete()

    # the sender has cancel the friend request
    def cancel(self):
        self.delete()
