from api.models import Message
from django.contrib.auth import get_user_model
from django.urls import reverse
from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from .factories import RoomFactory, UserFactory

User = get_user_model()
fake = Faker('ja_jp')


class MessageViewSetTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.access_token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.access_token))

    def test_create(self):
        url = reverse('message-list')
        room = RoomFactory()
        data = {'room': room.id, 'body': fake.text()}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.get().sender, self.user)
        self.assertEqual(Message.objects.get().room, room)
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
