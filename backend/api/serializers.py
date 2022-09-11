from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Message

User = get_user_model()


class SenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'icon']


class SetIconSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['icon']


class MessageSerializer(serializers.ModelSerializer):
    sender = SenderSerializer()

    class Meta:
        model = Message
        fields = ['id', 'created_at', 'sender', 'body']


class SendMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['body']
