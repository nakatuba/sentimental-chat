import factory
from api.models import Room
from django.contrib.auth import get_user_model
from faker import Faker

User = get_user_model()
fake = Faker('ja_jp')


class UserFactory(factory.django.DjangoModelFactory):
    username = fake.name()

    class Meta:
        model = User
        django_get_or_create = ('username',)


class RoomFactory(factory.django.DjangoModelFactory):
    owner = factory.SubFactory(UserFactory)

    class Meta:
        model = Room
