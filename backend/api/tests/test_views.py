from api.models import Message
from django.contrib.auth import get_user_model
from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .factories import RoomFactory, UserFactory

User = get_user_model()
fake = Faker('ja_jp')


class RoomMessageViewSetTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.room = RoomFactory()
        self.refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + str(self.refresh.access_token)
        )

    def test_create(self):
        url = reverse('room-messages-list', kwargs={'room_pk': self.room.id})
        data = {'body': fake.text()}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.get().sender, self.user)
        self.assertEqual(Message.objects.get().room, self.room)
        self.assertEqual(Message.objects.get().body, data['body'])
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
            score = getattr(Message.objects.get().sentiment_score, emotion)
            self.assertIsInstance(score, float)
            self.assertTrue(0 <= score <= 1)
