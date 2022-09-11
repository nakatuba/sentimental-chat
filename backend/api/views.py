import pusher
from chat import settings
from django.contrib.auth import get_user_model
from djoser import views
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Message
from .serializers import (MessageSerializer, SenderSerializer,
                          SendMessageSerializer, SetIconSerializer)

pusher_client = pusher.Pusher(
    app_id=settings.PUSHER_APP_ID,
    key=settings.PUSHER_APP_KEY,
    secret=settings.PUSHER_APP_SECRET,
    cluster=settings.PUSHER_APP_CLUSTER,
    ssl=True,
)

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

    @extend_schema(request=SendMessageSerializer, responses={201: MessageSerializer})
    @action(detail=False, methods=['post'])
    def send(self, request):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save(sender=request.user)

        serializer = self.get_serializer(message)
        pusher_client.trigger('public-channel', 'send-event', serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
