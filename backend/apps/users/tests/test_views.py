import pytest
import json
from unittest.mock import patch, MagicMock
from apps.users.views import login_view, logout_view
from django.test import RequestFactory
from apps.users.models import User


@pytest.fixture
def factory():
    return RequestFactory()


class TestUsersViews:

    def test_login_returns_400_when_no_authorization_header_provided(self, factory):
        request = factory.post("/login/")

        response = login_view(request)
        decoded_content = json.loads(response.content)

        assert response.status_code == 400
        assert decoded_content == {"error": "Bad request"}

    def test_login_returns_400_when_authorization_header_has_wrong_format(
        self, factory
    ):
        request_headers = {"Authorization": "InvalidFormat token123"}
        request = factory.post("/login/", headers=request_headers)

        response = login_view(request)
        decoded_content = json.loads(response.content)

        assert response.status_code == 400
        assert decoded_content == {"error": "Bad request"}

    @patch("apps.users.backends.FirebaseAuthenticationBackend.authenticate")
    def test_login_returns_401_when_authentication_fails(
        self, mock_authenticate, factory
    ):
        mock_authenticate.return_value = None
        request_headers = {"Authorization": "Bearer valid-token123"}
        request = factory.post("/login/", headers=request_headers)

        response = login_view(request)
        decoded_content = json.loads(response.content)

        assert response.status_code == 401
        assert decoded_content == {"error": "Unauthorized"}

    @patch("apps.users.backends.FirebaseAuthenticationBackend.authenticate")
    def test_login_returns_200_when_authentication_succeeds(
        self, mock_authenticate, factory
    ):
        mock_user = User(email="test@test.com")
        mock_authenticate.return_value = mock_user
        request_headers = {"Authorization": "Bearer valid-token123"}
        request = factory.post("/login/", headers=request_headers)

        response = login_view(request)
        decoded_content = json.loads(response.content)

        assert response.status_code == 200
        assert decoded_content == {"message": "Logged in successfully"}
        mock_authenticate.assert_called_once_with(
            request, firebase_token="valid-token123"
        )

    @patch("apps.users.views.logout")
    def test_logout_returns_200_and_calls_django_logout(self, mock_logout, factory):
        request = factory.post("/logout/")
        request.session = MagicMock()
        request.user = MagicMock()
        request.user.is_authenticated = True

        response = logout_view(request)
        decoded_content = json.loads(response.content)

        assert response.status_code == 200
        assert decoded_content == {"message": "Logged out successfully"}
        mock_logout.assert_called_once_with(request)
