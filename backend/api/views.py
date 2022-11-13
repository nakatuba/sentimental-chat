import requests
from django.contrib.auth import get_user_model
from djoser import views
from drf_spectacular.utils import extend_schema
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Message, SentimentScore
from .serializers import (MessageSerializer, SenderSerializer,
                          SendMessageSerializer, SetIconSerializer)

User = get_user_model()


class UserViewSet(views.UserViewSet):
    queryset = User.objects.all()
    serializer_class = SenderSerializer

    @extend_schema(request=SetIconSerializer, responses={204: None})
    @action(detail=False, methods=['post'])
    def set_icon(self, request):
        serializer = SetIconSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.icon = serializer.validated_data['icon']
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']

    @extend_schema(request=SendMessageSerializer, responses={201: MessageSerializer})
    @action(detail=False, methods=['post'])
    def send(self, request):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        res = requests.post(
            'http://analyzer:9000/analyze',
            json={'body': serializer.validated_data['body']},
        )
        sentiment_score = SentimentScore(**res.json())
        sentiment_score.save()
        message = serializer.save(sender=request.user, sentiment_score=sentiment_score)

        serializer = self.get_serializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
