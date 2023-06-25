from api.views import (MessageViewSet, RoomMessageViewSet, RoomViewSet,
                       UserRoomViewSet, UserViewSet)
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter

from . import settings

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('rooms', RoomViewSet)
router.register('messages', MessageViewSet)

users_router = NestedSimpleRouter(router, 'users', lookup='user')
users_router.register('rooms', UserRoomViewSet, basename='user-rooms')

rooms_router = NestedSimpleRouter(router, 'rooms', lookup='room')
rooms_router.register('messages', RoomMessageViewSet, basename='room-messages')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include(users_router.urls)),
    path('api/', include(rooms_router.urls)),
    path('api/auth/', include('djoser.urls.jwt')),
]

if settings.DEBUG:
    urlpatterns += [
        path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
        path(
            'api/schema/swagger-ui/',
            SpectacularSwaggerView.as_view(url_name='schema'),
            name='swagger-ui',
        ),
        path(
            'api/schema/redoc/',
            SpectacularRedocView.as_view(url_name='schema'),
            name='redoc',
        ),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
