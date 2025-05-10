import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate
from datetime import date

from .models import Trip, Flight
from .serializers import TripSerializer, FlightSerializer
from .views import TripViewSet, FlightViewSet

User = get_user_model()


@pytest.fixture
def user():
    return User.objects.create_user(username="testuser", password="testpass123")


@pytest.fixture
def another_user():
    return User.objects.create_user(username="anotheruser", password="testpass123")


@pytest.fixture
def trip_data():
    return {
        "name": "Test Trip",
        "description": "A test trip",
        "destination": "Test Destination",
        "start_date": date(2023, 1, 1),
        "end_date": date(2023, 1, 7),
    }


@pytest.fixture
def trip(user, trip_data):
    return Trip.objects.create(created_by=user, **trip_data)


@pytest.fixture
def another_trip(another_user, trip_data):
    return Trip.objects.create(created_by=another_user, **trip_data)


@pytest.fixture
def api_request_factory():
    return APIRequestFactory()


class TestTripViewSet:
    @pytest.mark.django_db
    def test_list_requires_authentication(self, api_request_factory):
        """Test that unauthenticated requests are denied."""
        request = api_request_factory.get("/api/trips/")
        view = TripViewSet.as_view({"get": "list"})
        response = view(request)

        # 403 Forbidden response expected
        assert response.status_code == 403, "Unauthenticated request should return 403"

    @pytest.mark.django_db
    def test_list_returns_only_user_trips(
        self, user, another_user, trip, another_trip, api_request_factory
    ):
        """Test that only trips owned by the current user are returned."""
        request = api_request_factory.get("/api/trips/")
        force_authenticate(request, user=user)
        view = TripViewSet.as_view({"get": "list"})
        response = view(request)

        assert response.status_code == 200, "Authenticated request should return 200"
        assert len(response.data) == 1, "Should only return trips owned by the user"
        assert response.data[0]["id"] == trip.id, "Should return the correct trip"

    @pytest.mark.django_db
    def test_retrieve_own_trip(self, user, trip, api_request_factory):
        """Test that a user can retrieve their own trip."""
        request = api_request_factory.get(f"/api/trips/{trip.id}/")
        force_authenticate(request, user=user)
        view = TripViewSet.as_view({"get": "retrieve"})
        response = view(request, pk=trip.id)

        assert response.status_code == 200, "User should be able to retrieve own trip"

    @pytest.mark.django_db
    def test_retrieve_other_user_trip(self, user, another_trip, api_request_factory):
        """Test that a user cannot retrieve another user's trip."""
        request = api_request_factory.get(f"/api/trips/{another_trip.id}/")
        force_authenticate(request, user=user)
        view = TripViewSet.as_view({"get": "retrieve"})
        response = view(request, pk=another_trip.id)

        assert (
            response.status_code == 404
        ), "User should not be able to retrieve other user's trip"


class TestTripSerializer:
    @pytest.mark.django_db
    def test_create_adds_user_as_created_by(
        self, user, trip_data, trip, api_request_factory
    ):
        """Test that the TripSerializer adds the user
        from the request as the created_by field.
        """
        # Create a request with a user
        request = api_request_factory.post("/api/trips/")
        request.user = user

        # Create the serializer with the request in the context
        serializer = TripSerializer(data=trip_data, context={"request": request})

        # Validate the serializer
        assert serializer.is_valid(), f"Serializer errors: {serializer.errors}"

        # Save the serializer to create the trip
        trip = serializer.save()

        # Assert that the created_by field is set to the user from the request
        assert (
            trip.created_by == user
        ), "The created_by field was not set to the user from the request"

        # Verify the trip was saved to the database with the correct user
        saved_trip = Trip.objects.get(id=trip.id)
        assert (
            saved_trip.created_by == user
        ), "The saved trip's created_by field does not match the user"


@pytest.fixture
def flight_data(trip):
    return {
        "trip_id": trip.id,
        "airline": "Test Airline",
        "confirmation_number": "ABC123",
        "flight_number": "TA123",
        "departure_airport": "SFO",
        "arrival_airport": "JFK",
        "departure_time": "2023-01-01T08:00:00Z",
        "arrival_time": "2023-01-01T16:00:00Z",
    }


@pytest.fixture
def flight(user, trip, flight_data):
    flight_data_copy = flight_data.copy()
    flight_data_copy.pop("trip_id")
    return Flight.objects.create(created_by=user, trip=trip, **flight_data_copy)


@pytest.fixture
def another_flight(another_user, another_trip, flight_data):
    flight_data_copy = flight_data.copy()
    flight_data_copy["trip_id"] = another_trip.id
    flight_data_copy.pop("trip_id")
    return Flight.objects.create(
        created_by=another_user, trip=another_trip, **flight_data_copy
    )


class TestFlightViewSet:
    @pytest.mark.django_db
    def test_list_requires_authentication(self, api_request_factory):
        """Test that unauthenticated requests are denied."""
        request = api_request_factory.get("/api/flights/")
        view = FlightViewSet.as_view({"get": "list"})
        response = view(request)

        assert response.status_code == 403, "Unauthenticated request should return 403"

    @pytest.mark.django_db
    def test_list_returns_only_user_flights(
        self, user, another_user, flight, another_flight, api_request_factory
    ):
        """Test that only flights owned by the current user are returned."""
        request = api_request_factory.get("/api/flights/")
        force_authenticate(request, user=user)
        view = FlightViewSet.as_view({"get": "list"})
        response = view(request)

        assert response.status_code == 200, "Authenticated request should return 200"
        # Get all IDs from the response
        flight_ids = [f["id"] for f in response.data]

        # Ensure our flight is included
        assert flight.id in flight_ids, "Should include the user's flight"

        # Ensure another user's flight is not included
        assert (
            another_flight.id not in flight_ids
        ), "Should not include another user's flight"

    @pytest.mark.django_db
    def test_retrieve_own_flight(self, user, flight, api_request_factory):
        """Test that a user can retrieve their own flight."""
        request = api_request_factory.get(f"/api/flights/{flight.id}/")
        force_authenticate(request, user=user)
        view = FlightViewSet.as_view({"get": "retrieve"})
        response = view(request, pk=flight.id)

        assert response.status_code == 200, "User should be able to retrieve own flight"

    @pytest.mark.django_db
    def test_retrieve_other_user_flight(
        self, user, another_flight, api_request_factory
    ):
        """Test that a user cannot retrieve another user's flight."""
        request = api_request_factory.get(f"/api/flights/{another_flight.id}/")
        force_authenticate(request, user=user)
        view = FlightViewSet.as_view({"get": "retrieve"})
        response = view(request, pk=another_flight.id)

        assert (
            response.status_code == 404
        ), "User should not be able to retrieve other user's flight"

    @pytest.mark.django_db
    def test_filter_by_trip_id(self, user, trip, flight, api_request_factory):
        """Test that flights can be filtered by trip_id."""

        # Create a second flight for the same user but different trip
        second_trip = Trip.objects.create(
            created_by=user,
            name="Second Trip",
            description="Another test trip",
            destination="Another Destination",
            start_date=date(2023, 2, 1),
            end_date=date(2023, 2, 7),
        )
        Flight.objects.create(
            created_by=user,
            trip=second_trip,
            airline="Another Airline",
            confirmation_number="XYZ789",
            flight_number="AA456",
            departure_airport="LAX",
            arrival_airport="ORD",
            departure_time="2023-02-01T10:00:00Z",
            arrival_time="2023-02-01T14:00:00Z",
        )

        # Request with trip_id filter
        request = api_request_factory.get(f"/api/flights/?trip_id={trip.id}")
        force_authenticate(request, user=user)
        view = FlightViewSet.as_view({"get": "list"})
        response = view(request)

        assert response.status_code == 200
        assert (
            len(response.data) == 1
        ), "Should only return flights for the specified trip"
        assert response.data[0]["id"] == flight.id, "Should return the correct flight"


class TestFlightSerializer:
    @pytest.mark.django_db
    def test_create_adds_user_as_created_by(
        self, user, trip, flight_data, api_request_factory
    ):
        """
        Test that the FlightSerializer adds the user
        from the request as the created_by field.
        """
        # Create a request with a user
        request = api_request_factory.post("/api/flights/")
        request.user = user

        # Create the serializer with the request in the context
        serializer = FlightSerializer(data=flight_data, context={"request": request})

        # Validate the serializer
        assert serializer.is_valid(), f"Serializer errors: {serializer.errors}"

        # Save the serializer to create the flight
        flight = serializer.save()

        # Assert that the created_by field is set to the user from the request
        assert (
            flight.created_by == user
        ), "The created_by field was not set to the user from the request"

        # Verify the flight was saved to the database with the correct user
        saved_flight = Flight.objects.get(id=flight.id)
        assert (
            saved_flight.created_by == user
        ), "The saved flight's created_by field does not match the user"

    @pytest.mark.django_db
    def test_create_associates_with_correct_trip(
        self, user, trip, flight_data, api_request_factory
    ):
        """
        Test that the FlightSerializer associates the flight
        with the correct trip.
        """
        # Create a request with a user
        request = api_request_factory.post("/api/flights/")
        request.user = user

        # Create the serializer with the request in the context
        serializer = FlightSerializer(data=flight_data, context={"request": request})

        # Validate the serializer
        assert serializer.is_valid(), f"Serializer errors: {serializer.errors}"

        # Save the serializer to create the flight
        flight = serializer.save()

        # Assert that the flight is associated with the correct trip
        assert (
            flight.trip.id == trip.id
        ), "The flight is not associated with the correct trip"

    @pytest.mark.django_db
    def test_validate_trip_id_with_nonexistent_trip(self, user, api_request_factory):
        """Test that the FlightSerializer validates trip_id correctly."""
        # Create flight data with a nonexistent trip_id
        invalid_flight_data = {
            "trip_id": 99999,  # Assuming this ID doesn't exist
            "airline": "Test Airline",
            "confirmation_number": "ABC123",
            "flight_number": "TA123",
            "departure_airport": "SFO",
            "arrival_airport": "JFK",
            "departure_time": "2023-01-01T08:00:00Z",
            "arrival_time": "2023-01-01T16:00:00Z",
        }

        # Create a request with a user
        request = api_request_factory.post("/api/flights/")
        request.user = user

        # Create the serializer with the request in the context
        serializer = FlightSerializer(
            data=invalid_flight_data, context={"request": request}
        )

        # Validate the serializer - should fail
        assert (
            not serializer.is_valid()
        ), "Serializer should not be valid with nonexistent trip_id"
        assert (
            "trip_id" in serializer.errors
        ), "Serializer should have an error for trip_id"
