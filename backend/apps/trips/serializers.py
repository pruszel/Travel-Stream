# backend/apps/trips/serializers.py

from rest_framework import serializers
from .models import Trip


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'id', 'name', 'description', 'destination',
            'start_date', 'end_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']

    def create(self, validated_data):
        # Get the current user from the request
        user = self.context['request'].user
        # Add the user as created_by
        validated_data['created_by'] = user
        return super().create(validated_data)
