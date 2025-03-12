from django.test import TestCase  # noqa: F401
import pytest
from django.contrib.auth import get_user_model


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
