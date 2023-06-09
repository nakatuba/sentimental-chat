from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Message, Room, SentimentScore

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'icon']


class SentimentScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentScore
        fields = [
            'joy',
            'sadness',
            'anticipation',
            'surprise',
            'anger',
            'fear',
            'disgust',
            'trust',
        ]


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    sentiment_score = SentimentScoreSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'created_at', 'sender', 'body', 'sentiment_score']


class RoomSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'name', 'messages']
