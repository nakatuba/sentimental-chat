from django.contrib.auth.models import User
from django.db import models


class Message(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
