from django.dispatch import receiver
from django.db.models.signals import post_save
from allauth.account.models import EmailAddress
from django.contrib.auth.models import User
from .models import Profile
from a_friends.models import FriendList

@receiver(post_save, sender=User)
def user_postsave(sender, instance, created, **kwargs):
    user = instance
    # add profile,FriendList if user is created
    if created:
        Profile.objects.create(user=user)
        FriendList.objects.create(user=user)
    else:
        # update allauth emailaddress if exists
        try:
            email_address = EmailAddress.objects.get_primary(user)
            if email_address.email != user.email:
                email_address.email = user.email
                email_address.verified = False
                email_address.save()
        except:
            # if allauth emailaddress doesn't exist create one
            EmailAddress.objects.create(
                user=user, email=user.email, primary=True, verified=False
            )