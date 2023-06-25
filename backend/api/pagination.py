from rest_framework import pagination


class RoomMessagePagination(pagination.CursorPagination):
    page_size = 100
    ordering = '-created_at'
