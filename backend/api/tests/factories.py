import factory
from api.models import Room
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    username = factory.Faker('user_name')

    class Meta:
        model = User
        django_get_or_create = ('username',)


class RoomFactory(factory.django.DjangoModelFactory):
    owner = factory.SubFactory(UserFactory)

    class Meta:
        model = Room
