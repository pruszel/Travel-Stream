from django.test import TestCase  # noqa: F401
import pytest
from django.contrib.auth import get_user_model
import time


User = get_user_model()


@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(
        username="testuser", email="test@example.com", password="testpass123"
    )

    # Assert that the user is an instance of our custom User model
    assert isinstance(user, User)

    # Assert that the user was created with the correct attributes
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.is_active is True
    assert user.is_staff is False
    assert user.is_superuser is False


@pytest.mark.django_db
def test_timestamps_on_creation():
    """Test that created_at and updated_at are set automatically"""
    user = User.objects.create_user(
        username="timeuser", email="time@example.com", password="testpass123"
    )

    assert user.created_at is not None
    assert user.updated_at is not None
    assert user.deleted_at is None
    # Check if timestamps are within 100ms of each other
    time_difference = abs(user.created_at - user.updated_at)
    assert time_difference.total_seconds() < 0.1  # 100ms


@pytest.mark.django_db
def test_updated_at_changes_on_update():
    """Test that updated_at changes when user is updated"""
    user = User.objects.create_user(
        username="updateuser", email="update@example.com", password="testpass123"
    )
    original_updated_at = user.updated_at

    # Wait a small amount of time to ensure timestamp will be different
    time.sleep(0.001)  # 1 millisecond
    user.email = "newemail@example.com"
    user.save()

    assert user.updated_at > original_updated_at


@pytest.mark.django_db
def test_soft_delete():
    """Test soft deletion functionality"""
    user = User.objects.create_user(
        username="deleteuser", email="delete@example.com", password="testpass123"
    )

    assert not user.is_deleted
    assert user.deleted_at is None

    # Perform soft delete
    user.delete()

    # Refresh from database
    user.refresh_from_db()

    assert user.is_deleted
    assert user.deleted_at is not None
    # Verify object still exists in database
    assert User.objects.filter(id=user.id).exists()


@pytest.mark.django_db
def test_restore():
    """Test restore functionality"""
    user = User.objects.create_user(
        username="restoreuser", email="restore@example.com", password="testpass123"
    )

    # First delete the user
    user.delete()
    user.refresh_from_db()

    # Then restore it
    user.restore()
    user.refresh_from_db()

    assert not user.is_deleted
    assert user.deleted_at is None


@pytest.mark.django_db
def test_erase():
    """Test hard deletion functionality"""
    user = User.objects.create_user(
        username="eraseuser", email="erase@example.com", password="testpass123"
    )
    user.erase()
    assert not User.objects.filter(id=user.id).exists()
