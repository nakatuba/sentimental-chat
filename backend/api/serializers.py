from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Message, Room, SentimentScore

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Room
        fields = '__all__'


class SentimentScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentScore
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    room = RoomSerializer(read_only=True)
    sentiment_score = SentimentScoreSerializer(read_only=True)

    class Meta:
        model = Message
        fields = '__all__'
