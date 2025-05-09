# backend/apps/trips/serializers.py

from rest_framework import serializers
from .models import Trip, Flight


class FlightSerializer(serializers.ModelSerializer):
    trip = serializers.PrimaryKeyRelatedField(queryset=Trip.objects.all())

    class Meta:
        model = Flight
        fields = [
            "id",
            "trip",
            "airline",
            "confirmation_number",
            "flight_number",
            "departure_airport",
            "arrival_airport",
            "departure_time",
            "arrival_time",
        ]
        read_only_fields = ["created_at", "updated_at", "created_by"]

    # noinspection PyMethodMayBeStatic
    def validate_trip_id(self, trip_id):
        """Make sure a trip with this id exists.

        This method is called automatically by DRF when validating the serializer.
        """
        try:
            Trip.objects.get(id=trip_id)
        except Trip.DoesNotExist:
            raise serializers.ValidationError(f"Trip id {trip_id} does not exist.")
        return trip_id

    def create(self, validated_data):
        # Add the user as created_by
        user = self.context["request"].user
        validated_data["created_by"] = user

        # Get the trip object using the trip_id
        trip_id = validated_data.pop("trip_id")
        trip = Trip.objects.get(id=trip_id)
        validated_data["trip"] = trip

        return super().create(validated_data)


class TripSerializer(serializers.ModelSerializer):
    flights = FlightSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = [
            "id",
            "name",
            "description",
            "destination",
            "start_date",
            "end_date",
            "created_at",
            "updated_at",
            "flights",
        ]
        read_only_fields = ["created_at", "updated_at", "created_by"]

    def create(self, validated_data):
        # Add the user as created_by
        user = self.context["request"].user
        validated_data["created_by"] = user

        return super().create(validated_data)
