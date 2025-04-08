# backend/apps/users/permissions.py

from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to view or edit it.
    Supports different ownership field names across models.
    """

    def has_permission(self, request, view):
        # Only allow authenticated users to access the view
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Get the ownership field name from the view or use a default
        owner_field = getattr(view, "owner_field", "user")

        # Get the owner from the object using the field name
        owner = getattr(obj, owner_field, None)

        # Check if the current user is the owner
        return owner == request.user
