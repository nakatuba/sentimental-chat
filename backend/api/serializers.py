from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Message, Room, SentimentScore

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    rooms = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'

    def get_rooms(self, obj):
        rooms = obj.rooms.order_by('created_at')
        return rooms.values('id', 'created_at', 'name')


class RoomSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = '__all__'

    def save(self, **kwargs):
        owner = self.context['request'].user
        return super().save(owner=owner, **kwargs)

    def get_messages(self, obj):
        messages = obj.messages.order_by('created_at')
        return MessageSerializer(messages, many=True, context=self.context).data


class SentimentScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentScore
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    sentiment_score = SentimentScoreSerializer(read_only=True)

    class Meta:
        model = Message
        fields = '__all__'
