from django.contrib.auth.models import AbstractUser
from django.db import models
from model_utils.models import UUIDModel


class User(AbstractUser, UUIDModel):
    icon = models.ImageField(null=True)
    REQUIRED_FIELDS = ['icon']


class Message(UUIDModel):
    created_at = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
