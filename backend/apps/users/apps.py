import base64
import binascii
import json
import logging

import firebase_admin
from django.apps import AppConfig
from django.conf import settings
from firebase_admin import credentials, exceptions

logger = logging.getLogger(__name__)


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.users"
    firebase_app = None

    def ready(self):
        if not self.firebase_app:
            self._initialize_firebase()

    def _initialize_firebase(self):
        """
        Initialize Firebase Admin SDK with service account credentials.

        Returns:
            None
        """
        try:
            decoded_credentials = self._decode_firebase_credentials()
            if decoded_credentials:
                cred = credentials.Certificate(decoded_credentials)
                self.firebase_app = firebase_admin.initialize_app(cred)
        except exceptions.FirebaseError as e:
            logger.error(f"Firebase initialization error: {e}")

    @staticmethod
    def _decode_firebase_credentials(
            encoded_credentials=settings.GOOGLE_APPLICATION_CREDENTIALS,
    ):
        """
        Decode the base64 encoded Firebase service account credentials.
        This was added to support using JSON-formatted Firebase credentials as an environment secret on Fly.io.

        Args:
            encoded_credentials:
                Base64 encoded Firebase service account credentials string.
        Returns:
            Decoded Firebase service account credentials as a dictionary.
        """
        try:
            decoded_bytes = base64.b64decode(encoded_credentials)
            decoded_string = decoded_bytes.decode("utf-8")
            decoded_credentials = json.loads(decoded_string)
            return decoded_credentials
        except (ValueError, json.JSONDecodeError, binascii.Error) as e:
            logger.error(f"Error decoding Firebase credentials: {e}")
            return None
