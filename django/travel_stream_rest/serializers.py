from rest_framework import serializers
from travel_stream_rest.models.reservation import Reservation


class ReservationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=127)
    phone = serializers.CharField(max_length=31, required=False)
    email = serializers.EmailField()
    traveling_from = serializers.CharField(max_length=255)
    destination = serializers.CharField(max_length=255)
    departure_date = serializers.DateField()
    return_date = serializers.DateField(required=False)
    adults = serializers.IntegerField(required=False)
    children = serializers.IntegerField(required=False)
    infants = serializers.IntegerField(required=False)
    created_at = serializers.DateTimeField(read_only=True)

    def validate(self, data):
        if data.get('return_date') and data.get('departure_date'):
            if data['return_date'] < data['departure_date']:
                raise serializers.ValidationError(
                    {'return_date': 'Return date must be after departure date'})
        if data['adults'] < 1:
            raise serializers.ValidationError(
                {'adults': 'At least one adult is required'})
        if data.get('children') and data['children'] < 0:
            raise serializers.ValidationError(
                {'children': 'Number of children cannot be negative'})
        if data.get('infants') and data['infants'] < 0:
            raise serializers.ValidationError(
                {'infants': 'Number of infants cannot be negative'})
        return data

    def create(self, validated_data):
        return Reservation.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.email = validated_data.get('email', instance.email)
        instance.traveling_from = validated_data.get(
            'traveling_from', instance.traveling_from)
        instance.destination = validated_data.get(
            'destination', instance.destination)
        instance.departure_date = validated_data.get(
            'departure_date', instance.departure_date)
        instance.return_date = validated_data.get(
            'return_date', instance.return_date)
        instance.adults = validated_data.get('adults', instance.adults)
        instance.children = validated_data.get('children', instance.children)
        instance.infants = validated_data.get('infants', instance.infants)
        instance.save()
        return instance
