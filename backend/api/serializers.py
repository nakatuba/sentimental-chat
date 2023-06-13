from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Message, Room, SentimentScore

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    rooms = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'icon', 'rooms']

    def get_rooms(self, obj):
        rooms = obj.rooms.order_by('created_at')
        return rooms.values('id', 'created_at', 'name')


class RoomSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'created_at', 'owner', 'name', 'messages']

    def save(self, **kwargs):
        owner = self.context['request'].user
        return super().save(owner=owner, **kwargs)

    def get_messages(self, obj):
        messages = obj.messages.order_by('created_at')
        return MessageSerializer(messages, many=True, context=self.context).data


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
        fields = ['id', 'created_at', 'sender', 'room', 'body', 'sentiment_score']
