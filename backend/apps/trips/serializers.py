# backend/apps/trips/serializers.py

from rest_framework import serializers
from .models import Trip, Flight


class FlightSerializer(serializers.ModelSerializer):
    trip = serializers.PrimaryKeyRelatedField(
        queryset=Trip.objects.all(), required=False
    )
    trip_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Flight
        fields = [
            "id",
            "trip",
            "trip_id",
            "airline",
            "confirmation_number",
            "flight_number",
            "departure_airport",
            "arrival_airport",
            "departure_time",
            "arrival_time",
        ]
        read_only_fields = ["created_at", "updated_at", "created_by"]

    def validate(self, data):
        """Validate the entire object."""
        # Validate that either trip or trip_id is provided
        if "trip" not in data and "trip_id" not in data:
            raise serializers.ValidationError(
                "Either trip or trip_id must be provided."
            )

        # Validate trip_id if provided
        if "trip_id" in data and not Trip.objects.filter(id=data["trip_id"]).exists():
            raise serializers.ValidationError(
                {"trip_id": f"Trip id {data['trip_id']} does not exist."}
            )

        return data

    def create(self, validated_data):
        # Add the user as created_by
        user = self.context["request"].user
        validated_data["created_by"] = user

        # Get the trip object using the trip_id if provided
        if "trip_id" in validated_data:
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
