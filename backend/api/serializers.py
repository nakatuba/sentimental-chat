from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Message, SentimentScore

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'icon']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret['icon'] is not None:
            ret['icon'] = ret['icon'].replace('http://backend', 'http://localhost')
        return ret


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
    sender = UserSerializer()
    sentiment_score = SentimentScoreSerializer()

    class Meta:
        model = Message
        fields = ['id', 'created_at', 'sender', 'body', 'sentiment_score']


class CreateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['body']
