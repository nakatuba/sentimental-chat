from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Message, SentimentScore

User = get_user_model()


class SenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'icon']


class SetIconSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['icon']


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
    sender = SenderSerializer()
    sentiment_score = SentimentScoreSerializer()

    class Meta:
        model = Message
        fields = ['id', 'created_at', 'sender', 'body', 'sentiment_score']


class SendMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['body']
