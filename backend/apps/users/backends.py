from django.contrib.auth.backends import BaseBackend
from django.utils import timezone
from firebase_admin import auth
from googleapiclient.http import HttpRequest

from .models import User


def _verify_token(firebase_token: str) -> dict | None:
    """
    Verify the given Firebase ID token using the Firebase Admin SDK.

    Args:
        firebase_token: The Firebase ID token.

    Returns:
        dict: If the token is valid, a dictionary of key-value pairs
            parsed from the decoded JWT.
        None: If the token is invalid or expired.
    """
    try:
        decoded_token = auth.verify_id_token(firebase_token)
        return decoded_token
    except (
        ValueError,
        auth.InvalidIdTokenError,
        auth.ExpiredIdTokenError,
        auth.RevokedIdTokenError,
        auth.CertificateFetchError,
        auth.UserDisabledError,
    ):
        return None


class FirebaseAuthenticationBackend(BaseBackend):
    """
    Custom authentication backend for Firebase Authentication.
    This backend verifies a Firebase ID token and either retrieves the associated user
    from the database or creates one.
    """

    def authenticate(
        self, request: HttpRequest | None, firebase_token=None
    ) -> User | None:
        """
        Authenticate the user using the Firebase UID.

        Args:
            request: The HTTP request object or None if called from the backend.
            firebase_token: The Firebase ID token containing the Firebase uid.

        Returns:
            User instance if authentication is successful, None otherwise.
        """
        if not firebase_token:
            return None

        decoded_token = _verify_token(firebase_token)
        if not decoded_token:
            return None

        firebase_uid = decoded_token.get("uid")

        user, created = User.objects.get_or_create(firebase_uid=firebase_uid)
        if created:
            user.email = decoded_token.get("email", "")
            user.set_unusable_password()

        user.last_login_at = timezone.now()
        user.last_login_ip = request.META.get("HTTP_X_FORWARDED_FOR")
        user.last_login_user_agent = request.META.get("HTTP_USER_AGENT", "unknown")
        user.save()

        return user

    def get_user(self, user_id):
        """
        Retrieve the user by ID.

        Args:
            user_id: The ID of the user.

        Returns:
            User instance if found, None otherwise.
        """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
