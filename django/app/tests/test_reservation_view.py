from django.test import TestCase, Client
from django.urls import reverse
from app.models import Reservation
import json

class ReservationViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('reserve')
        self.valid_payload = {
            'name': 'Test User',
            'phone': '+1234567890',
            'email': 'test@example.com',
            'from': 'New York',
            'destination': 'London',
            'departureDate': '2024-03-20',
            'returnDate': '2024-03-25',
            'adults': 2,
            'children': 1,
            'infants': 0
        }

    def test_post_only(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)

    def test_invalid_json(self):
        response = self.client.post(
            self.url,
            data='invalid json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['error'], 'Invalid JSON')

    def test_successful_reservation(self):
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertIn('id', data)
        self.assertTrue(Reservation.objects.filter(id=data['id']).exists())

    def test_invalid_dates(self):
        payload = self.valid_payload.copy()
        payload['departureDate']  = '2024-03-20'
        payload['returnDate'] = '2024-03-19'  # Before departure
        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('return_date', json.loads(response.content)['errors'])
