import pusher
from chat import settings
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Message
from .serializers import MessageSerializer, UserSerializer

pusher_client = pusher.Pusher(
    app_id=settings.PUSHER_APP_ID,
    key=settings.PUSHER_APP_KEY,
    secret=settings.PUSHER_APP_SECRET,
    cluster=settings.PUSHER_APP_CLUSTER,
    ssl=True,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


@extend_schema(
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'body': {'type': 'string'},
            },
        }
    },
    responses=MessageSerializer,
)
@api_view(['POST'])
def send(request):
    serializer = MessageSerializer(
        data={
            'sender': request.user.id,
            'body': request.data['body'],
        }
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    pusher_client.trigger('public-channel', 'send-event', serializer.data)

    return Response(serializer.data)
