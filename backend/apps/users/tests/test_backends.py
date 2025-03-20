import pytest
from unittest.mock import patch, MagicMock
from django.utils import timezone
from django.http import HttpRequest
from apps.users.backends import FirebaseAuthenticationBackend, _verify_token
from apps.users.models import User


@pytest.fixture
def mock_request():
    """Create a mock HttpRequest object with test data."""
    request = MagicMock(spec=HttpRequest)
    request.META = {
        "HTTP_X_FORWARDED_FOR": "192.168.1.1",
        "HTTP_USER_AGENT": "Test User Agent",
    }
    return request


@pytest.mark.django_db
class TestFirebaseAuthenticationBackend:

    def test_verify_token_success(self):
        """Test successful token verification."""
        with patch("firebase_admin.auth.verify_id_token") as mock_verify:
            # Setup mock to return a valid token response
            mock_verify.return_value = {"uid": "firebase123"}

            # Call the function
            result = _verify_token("valid_token")

            # Assertions
            assert result == {"uid": "firebase123"}
            mock_verify.assert_called_once_with("valid_token")

    def test_verify_token_failure(self):
        """Test token verification failure cases."""
        with patch("firebase_admin.auth.verify_id_token") as mock_verify:
            # Setup mock to raise an exception
            mock_verify.side_effect = ValueError("Invalid token")

            # Call the function
            result = _verify_token("invalid_token")

            # Assertions
            assert result is None
            mock_verify.assert_called_once_with("invalid_token")

    def test_authenticate_no_token(self):
        """Test authentication with no token provided."""
        backend = FirebaseAuthenticationBackend()
        result = backend.authenticate(None, firebase_token=None)
        assert result is None

    def test_authenticate_invalid_token(self, mock_request):
        """Test authentication with an invalid token."""
        with patch("apps.users.backends._verify_token") as mock_verify:
            mock_verify.return_value = None

            backend = FirebaseAuthenticationBackend()
            result = backend.authenticate(mock_request, firebase_token="invalid_token")

            assert result is None
            mock_verify.assert_called_once_with("invalid_token")

    def test_authenticate_existing_user(self, mock_request):
        """Test authentication with a valid token for an existing user."""
        # Create a user first
        user = User.objects.create(firebase_uid="firebase123")
        old_login_time = timezone.now()
        user.last_login_at = old_login_time
        user.save()

        with patch("apps.users.backends._verify_token") as mock_verify:
            mock_verify.return_value = {"uid": "firebase123"}

            backend = FirebaseAuthenticationBackend()
            authenticated_user = backend.authenticate(
                mock_request, firebase_token="valid_token"
            )

            # Refresh from database
            user.refresh_from_db()

            assert authenticated_user.id == user.id
            assert authenticated_user.firebase_uid == "firebase123"
            assert authenticated_user.last_login_at > old_login_time
            assert authenticated_user.last_login_ip == "192.168.1.1"
            assert authenticated_user.last_login_user_agent == "Test User Agent"

    def test_authenticate_new_user(self, mock_request):
        """Test authentication with a valid token for a new user."""
        with patch("apps.users.backends._verify_token") as mock_verify:
            mock_verify.return_value = {"uid": "new_firebase_uid"}

            backend = FirebaseAuthenticationBackend()

            # Check user count before
            user_count_before = User.objects.count()

            authenticated_user = backend.authenticate(
                mock_request, firebase_token="valid_token"
            )

            # Check user count after
            user_count_after = User.objects.count()

            assert user_count_after == user_count_before + 1
            assert authenticated_user.firebase_uid == "new_firebase_uid"
            assert not authenticated_user.has_usable_password()
            assert authenticated_user.last_login_ip == "192.168.1.1"
            assert authenticated_user.last_login_user_agent == "Test User Agent"

    def test_get_user_existing(self):
        """Test get_user with an existing user ID."""
        user = User.objects.create(firebase_uid="firebase123")

        backend = FirebaseAuthenticationBackend()
        result = backend.get_user(user.id)

        assert result == user

    def test_get_user_nonexistent(self):
        """Test get_user with a non-existent user ID."""
        backend = FirebaseAuthenticationBackend()
        result = backend.get_user(999)

        assert result is None
