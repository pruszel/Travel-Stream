# backend/apps/users/authentication.py

from rest_framework import authentication
from rest_framework import exceptions

from .backends import FirebaseAuthenticationBackend


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Firebase token based authentication using Bearer token format.

    Clients should authenticate by passing the Firebase ID token in the
    "Authorization" HTTP header, prepended with the string "Bearer ".
    For example: Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbG...
    """

    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            return None

        parts = auth_header.split()

        if parts[0].lower() != self.keyword.lower():
            # Not our auth type
            return None

        if len(parts) == 1:
            msg = "Invalid token header. No credentials provided."
            raise exceptions.AuthenticationFailed(msg)
        elif len(parts) > 2:
            msg = "Invalid token header. Token string should not contain spaces."
            raise exceptions.AuthenticationFailed(msg)

        firebase_token = parts[1]

        # Use the existing authentication backend
        backend = FirebaseAuthenticationBackend()
        user = backend.authenticate(request, firebase_token=firebase_token)

        if not user:
            raise exceptions.AuthenticationFailed("Invalid token.")

        return user, firebase_token
