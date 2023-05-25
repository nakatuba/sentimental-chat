import requests
from chat import settings
from django.contrib.auth import get_user_model
from djoser import views
from drf_spectacular.utils import extend_schema
from rest_framework import filters, status, viewsets
from rest_framework.response import Response

from .models import Message, SentimentScore
from .serializers import (CreateMessageSerializer, MessageSerializer,
                          UserSerializer)

User = get_user_model()


class UserViewSet(views.UserViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']

    @extend_schema(request=CreateMessageSerializer, responses={201: MessageSerializer})
    def create(self, request):
        serializer = CreateMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        res = requests.post(
            f'{settings.ANALYZER_HOST}/analyze',
            json={'body': serializer.validated_data['body']},
        )
        sentiment_score = SentimentScore(**res.json())
        sentiment_score.save()
        message = serializer.save(sender=request.user, sentiment_score=sentiment_score)

        serializer = self.get_serializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
