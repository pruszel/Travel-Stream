# backend/apps/trips/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Trip
from .serializers import TripSerializer
from apps.users.permissions import IsOwner


class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    owner_field = "created_by"

    def get_queryset(self):
        # Return only the trips owned by the current user.
        return Trip.objects.filter(created_by=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
