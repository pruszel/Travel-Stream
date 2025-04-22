import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate
from datetime import date

from .models import Trip
from .serializers import TripSerializer
from .views import TripViewSet

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
        """Test that the TripSerializer adds the user from the request as the created_by field."""
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
