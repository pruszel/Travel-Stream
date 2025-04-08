# backend/apps/users/tests/test_permissions.py

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView

from ..permissions import IsOwner


# Create a dummy model class for testing
class DummyModel:
    def __init__(self, user=None, owner=None):
        self.user = user
        self.owner = owner


# Create a dummy view for testing
class DummyView(APIView):
    permission_classes = [IsOwner]
    owner_field = "user"  # Default


class DummyViewCustomField(APIView):
    permission_classes = [IsOwner]
    owner_field = "owner"  # Custom owner field


class IsOwnerPermissionTest(TestCase):
    def setUp(self):
        User = get_user_model()

        # Create users for testing
        self.user1 = User.objects.create_user(
            username="user1", email="user1@example.com", password="password123"
        )

        self.user2 = User.objects.create_user(
            username="user2", email="user2@example.com", password="password123"
        )

        # Create an unauthenticated request
        self.factory = APIRequestFactory()
        self.anon_request = self.factory.get("/dummy/")
        # In Django REST Framework, AnonymousUser is typically added by middleware
        # We need to simulate this in our tests
        from django.contrib.auth.models import AnonymousUser

        self.anon_request.user = AnonymousUser()

        # Create authenticated requests
        self.user1_request = self.factory.get("/dummy/")
        self.user1_request.user = self.user1

        self.user2_request = self.factory.get("/dummy/")
        self.user2_request.user = self.user2

        # Create permission instance
        self.permission = IsOwner()

        # Create dummy objects
        self.user1_obj = DummyModel(user=self.user1)
        self.user2_obj = DummyModel(user=self.user2)
        self.custom_user1_obj = DummyModel(owner=self.user1)

    def test_has_permission_authenticated(self):
        """Test that has_permission returns True for authenticated users."""
        self.assertTrue(self.permission.has_permission(self.user1_request, DummyView()))
        self.assertTrue(self.permission.has_permission(self.user2_request, DummyView()))

    def test_has_permission_unauthenticated(self):
        """Test that has_permission returns False for unauthenticated users."""
        self.assertFalse(self.permission.has_permission(self.anon_request, DummyView()))

    def test_has_object_permission_owner(self):
        """Test that has_object_permission returns True when user is owner."""
        view = DummyView()
        self.assertTrue(
            self.permission.has_object_permission(
                self.user1_request, view, self.user1_obj
            )
        )

    def test_has_object_permission_not_owner(self):
        """Test that has_object_permission returns False when user is not owner."""
        view = DummyView()
        self.assertFalse(
            self.permission.has_object_permission(
                self.user1_request, view, self.user2_obj
            )
        )
        self.assertFalse(
            self.permission.has_object_permission(
                self.user2_request, view, self.user1_obj
            )
        )

    def test_custom_owner_field(self):
        """Test that has_object_permission respects custom owner_field on view."""
        view = DummyViewCustomField()
        self.assertTrue(
            self.permission.has_object_permission(
                self.user1_request, view, self.custom_user1_obj
            )
        )
        self.assertFalse(
            self.permission.has_object_permission(
                self.user2_request, view, self.custom_user1_obj
            )
        )

    def test_missing_owner_field(self):
        """Test behavior when the owner field is missing from the object."""
        view = DummyView()
        obj_without_owner = DummyModel()  # No user or owner set
        self.assertFalse(
            self.permission.has_object_permission(
                self.user1_request, view, obj_without_owner
            )
        )

    def test_different_owner_field(self):
        """Test when view specifies a field that doesn't exist on the object."""

        class ViewWithInvalidField(APIView):
            permission_classes = [IsOwner]
            owner_field = "nonexistent_field"

        view = ViewWithInvalidField()
        self.assertFalse(
            self.permission.has_object_permission(
                self.user1_request, view, self.user1_obj
            )
        )
