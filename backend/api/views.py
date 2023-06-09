import requests
from chat import settings
from django.contrib.auth import get_user_model
from djoser import views
from rest_framework import filters, status, viewsets
from rest_framework.response import Response

from .models import Message, Room, SentimentScore
from .serializers import MessageSerializer, RoomSerializer, UserSerializer

User = get_user_model()


class UserViewSet(views.UserViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        res = requests.post(
            f'{settings.ANALYZER_HOST}/analyze',
            json={'body': serializer.validated_data['body']},
        )
        sentiment_score = SentimentScore(**res.json())
        sentiment_score.save()
        serializer.save(sender=request.user, sentiment_score=sentiment_score)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
