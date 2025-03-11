import pytest
from django.urls import reverse
from django.test import Client

@pytest.fixture
def client():
    return Client()

def test_health_check_success(client):
    url = reverse('health_check')
    response = client.get(url)

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
