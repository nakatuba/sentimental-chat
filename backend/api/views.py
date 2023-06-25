import requests
from chat import settings
from django.contrib.auth import get_user_model
from djoser import views
from rest_framework import viewsets

from .models import Message, Room, SentimentScore
from .pagination import RoomMessagePagination
from .serializers import MessageSerializer, RoomSerializer, UserSerializer

User = get_user_model()


class UserViewSet(views.UserViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UserRoomViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.filter(owner=self.kwargs['user_id'])


class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class RoomMessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    pagination_class = RoomMessagePagination

    def get_queryset(self):
        return Message.objects.filter(room=self.kwargs['room_pk'])

    def perform_create(self, serializer):
        res = requests.post(
            f'{settings.ANALYZER_HOST}/analyze',
            json={'body': serializer.validated_data['body']},
        )
        sentiment_score = SentimentScore.objects.create(**res.json())
        serializer.save(
            sender=self.request.user,
            room_id=self.kwargs['room_pk'],
            sentiment_score=sentiment_score,
        )
