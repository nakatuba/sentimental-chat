from django.contrib.auth.models import AbstractUser
from django.db import models
from model_utils.models import UUIDModel


def user_icon_path(instance, filename):
    return f'user/{instance.id}/icon/{filename}'


class User(AbstractUser, UUIDModel):
    icon = models.ImageField(upload_to=user_icon_path, blank=True)
    REQUIRED_FIELDS = ['icon']


class SentimentScore(UUIDModel):
    joy = models.FloatField()
    sadness = models.FloatField()
    anticipation = models.FloatField()
    surprise = models.FloatField()
    anger = models.FloatField()
    fear = models.FloatField()
    disgust = models.FloatField()
    trust = models.FloatField()


class Message(UUIDModel):
    created_at = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    sentiment_score = models.OneToOneField(
        SentimentScore, on_delete=models.CASCADE, null=True, blank=True
    )
