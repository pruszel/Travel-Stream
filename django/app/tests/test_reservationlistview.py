import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from app.models import Reservation


@pytest.mark.django_db
class TestReservationListView:

    @pytest.fixture(autouse=True)
    def setup(self):
        self.client = APIClient()
        self.url = reverse('reservation-list')
        self.valid_payload = {
            'name': 'Test User',
            'phone': '+1234567890',
            'email': 'test@example.com',
            'traveling_from': 'New York',
            'destination': 'London',
            'departure_date': '2024-03-20',
            'return_date': '2024-03-25',
            'adults': 2,
            'children': 1,
            'infants': 0
        }

    def test_get_reservations(self):
        response = self.client.get(self.url)
        assert response.status_code == status.HTTP_200_OK

    def test_create_reservation(self):
        response = self.client.post(
            self.url,
            data=self.valid_payload,
            format='json'
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Reservation.objects.filter(email='test@example.com').exists()

    def test_create_reservation_with_invalid_payload(self):
        # name is required
        invalid_payload = self.valid_payload.copy()
        invalid_payload.pop('name')
        response = self.client.post(
            self.url,
            data=invalid_payload,
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data
        # email is required
        invalid_payload = self.valid_payload.copy()
        invalid_payload.pop('email')
        response = self.client.post(
            self.url,
            data=invalid_payload,
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
        # Return date must be after departure date
        invalid_payload = self.valid_payload.copy()
        invalid_payload['departure_date'] = '2024-03-20'
        invalid_payload['return_date'] = '2024-03-19'  # Before departure
        response = self.client.post(
            self.url,
            data=invalid_payload,
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'return_date' in response.data
        # At least one adult is required
        invalid_payload = self.valid_payload.copy()
        invalid_payload['adults'] = 0
        response = self.client.post(
            self.url,
            data=invalid_payload,
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'adults' in response.data
        # Number of children cannot be negative
        invalid_payload = self.valid_payload.copy()
        invalid_payload['children'] = -1
        response = self.client.post(
            self.url,
            data=invalid_payload,
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'children' in response.data
        # Number of infants cannot be negative
        invalid_payload = self.valid_payload.copy()
        invalid_payload['infants'] = -1
        response = self.client.post(
            self.url,
            data=invalid_payload,
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'infants' in response.data

