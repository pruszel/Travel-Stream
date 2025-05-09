# backend/apps/trips/views.py
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Trip, Flight
from .serializers import TripSerializer, FlightSerializer
from apps.users.permissions import IsOwner


class OwnerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    owner_field = "created_by"

    def get_queryset(self):
        """Return only objects owned by the current user."""
        model_class = self.serializer_class.Meta.model
        return model_class.objects.filter(created_by=self.request.user)

    def get_object(self):
        """Override get_object to ensure the user is the owner of the object."""
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_context(self):
        """Add the request instance to the serializer context for auth information."""
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class TripViewSet(OwnerViewSet):
    serializer_class = TripSerializer
    queryset = Trip.objects.all()


class FlightViewSet(OwnerViewSet):
    serializer_class = FlightSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned flights to a given trip,
        by filtering against a `trip_id` query parameter in the URL.
        """
        queryset = super().get_queryset()
        trip_id = self.request.query_params.get("trip_id")
        if trip_id is not None:
            queryset = queryset.filter(trip_id=trip_id)
        return queryset
