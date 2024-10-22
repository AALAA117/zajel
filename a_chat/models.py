# models.py
from django.db import models
from django.contrib.auth.models import User

class ZajelMessage(models.Model):

    group_name = models.ForeignKey('ZajelGroup', on_delete=models.CASCADE, related_name='chat_messages')
    author = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.author} : {self.body}'
    

   

class ZajelGroup(models.Model):
    group_name = models.CharField(max_length=50, unique=True)
    members = models.ManyToManyField(User , related_name='chat_groups' , blank=True)
    image = models.ImageField(upload_to="group_image/", null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.group_name

    @property
    def name(self):
        return self.__str__()
    