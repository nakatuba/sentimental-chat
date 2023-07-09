from api.models import Message, Room
from django.contrib.auth import get_user_model
from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .factories import MessageFactory, RoomFactory, UserFactory

User = get_user_model()
fake = Faker('ja_JP')


class RoomViewSetTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.refresh.access_token)
        )

    def test_create(self):
        url = reverse('room-list')
        data = {'name': fake.word()}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Room.objects.count(), 1)
        room = Room.objects.get(pk=response.data['id'])
        self.assertEqual(room.owner, self.user)
        self.assertEqual(room.name, data['name'])


class UserRoomViewSetTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.rooms = RoomFactory.create_batch(10, owner=self.user)
        self.refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.refresh.access_token)
        )

    def test_list(self):
        url = reverse('user-rooms-list', kwargs={'user_id': self.user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.rooms))


class RoomMessageViewSetTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.room = RoomFactory()
        self.messages = MessageFactory.create_batch(10, room=self.room)
        self.refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.refresh.access_token)
        )

    def test_list(self):
        url = reverse('room-messages-list', kwargs={'room_pk': self.room.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), len(self.messages))

    def test_create(self):
        url = reverse('room-messages-list', kwargs={'room_pk': self.room.id})
        data = {'body': fake.text()}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), len(self.messages) + 1)
        message = Message.objects.get(pk=response.data['id'])
        self.assertEqual(message.sender, self.user)
        self.assertEqual(message.room, self.room)
        self.assertEqual(message.body, data['body'])
        for emotion in [
            'joy',
            'sadness',
            'anticipation',
            'surprise',
            'anger',
            'fear',
            'disgust',
            'trust',
        ]:
            score = getattr(message.sentiment_score, emotion)
            self.assertIsInstance(score, float)
            self.assertTrue(0 <= score <= 1)
