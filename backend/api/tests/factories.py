import factory
import factory.fuzzy
from api.models import Message, Room, SentimentScore
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    username = factory.Faker('user_name')

    class Meta:
        model = User


class RoomFactory(factory.django.DjangoModelFactory):
    owner = factory.SubFactory(UserFactory)
    name = factory.Faker('word')

    class Meta:
        model = Room


class SentimentScoreFactory(factory.django.DjangoModelFactory):
    joy = factory.fuzzy.FuzzyFloat(1)
    sadness = factory.fuzzy.FuzzyFloat(1)
    anticipation = factory.fuzzy.FuzzyFloat(1)
    surprise = factory.fuzzy.FuzzyFloat(1)
    anger = factory.fuzzy.FuzzyFloat(1)
    fear = factory.fuzzy.FuzzyFloat(1)
    disgust = factory.fuzzy.FuzzyFloat(1)
    trust = factory.fuzzy.FuzzyFloat(1)

    class Meta:
        model = SentimentScore


class MessageFactory(factory.django.DjangoModelFactory):
    sender = factory.SubFactory(UserFactory)
    room = factory.SubFactory(RoomFactory)
    body = factory.Faker('text')
    sentiment_score = factory.SubFactory(SentimentScoreFactory)

    class Meta:
        model = Message
