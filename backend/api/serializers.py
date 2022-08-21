from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Message


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'created_at', 'sender', 'body']
