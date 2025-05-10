from django.db import models

import apps.core.models


class Trip(apps.core.models.BaseModel):
    """
    Trip model to store basic trip information.
    """

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    destination = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name


class Flight(apps.core.models.BaseModel):
    """
    Flight model to store flight information related to a trip.
    """

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="flights")
    airline = models.CharField(max_length=255)
    confirmation_number = models.CharField(max_length=255, blank=True, null=True)
    flight_number = models.CharField(max_length=255)
    departure_airport = models.CharField(max_length=255)
    arrival_airport = models.CharField(max_length=255)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()

    def __str__(self):
        return (
            f"{self.flight_number}: {self.departure_airport} → {self.arrival_airport}"
        )
