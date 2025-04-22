import pytest
from django.contrib.auth import get_user_model
import time

from .models import SampleBaseModel

User = get_user_model()


@pytest.fixture
def user():
    return User.objects.create_user(username="testuser", password="testpass123")


@pytest.fixture
def test_model(user):
    return SampleBaseModel.objects.create(
        name="Test Instance", created_by=user, updated_by=user
    )


class TestSampleBaseModel:

    @pytest.mark.django_db
    def test_timestamps_on_creation(self, test_model):
        """Test that created_at and updated_at are set automatically"""
        assert test_model.created_at is not None
        assert test_model.updated_at is not None
        assert test_model.deleted_at is None
        # Check if timestamps are within 100ms of each other
        time_difference = abs(test_model.created_at - test_model.updated_at)
        assert time_difference.total_seconds() < 0.1  # 100ms

    @pytest.mark.django_db
    def test_updated_at_changes_on_update(self, test_model):
        """Test that updated_at changes when model is updated"""
        original_updated_at = test_model.updated_at
        # Wait a small amount of time to ensure timestamp will be different
        time.sleep(0.001)  # 1 millisecond
        test_model.name = "Updated Name"
        test_model.save()
        assert test_model.updated_at > original_updated_at

    @pytest.mark.django_db
    def test_soft_delete(self, test_model):
        """Test soft deletion functionality"""
        assert not test_model.is_deleted
        assert test_model.deleted_at is None

        # Perform soft delete
        test_model.delete()

        # Refresh from database
        test_model.refresh_from_db()

        assert test_model.is_deleted
        assert test_model.deleted_at is not None
        # Verify object still exists in database
        assert SampleBaseModel.all_objects.filter(id=test_model.id).exists()

    @pytest.mark.django_db
    def test_restore(self, test_model):
        """Test restore functionality"""
        # First delete the model
        test_model.delete()
        test_model.refresh_from_db()

        # Then restore it
        test_model.restore()
        test_model.refresh_from_db()

        assert not test_model.is_deleted
        assert test_model.deleted_at is None

    @pytest.mark.django_db
    def test_erase(self, test_model):
        """Test hard deletion functionality"""
        model_id = test_model.id
        test_model.erase()

        # Verify object is actually deleted from database
        assert not SampleBaseModel.objects.filter(id=model_id).exists()

    @pytest.mark.django_db
    def test_user_tracking(self, test_model, user):
        """Test that created_by and updated_by are tracked correctly"""
        # Test initial user tracking
        assert test_model.created_by == user
        assert test_model.updated_by == user

        # Create a new user and update the model
        new_user = User.objects.create_user(username="newuser", password="testpass123")
        test_model.updated_by = new_user
        test_model.save()

        # Verify created_by remains unchanged while updated_by changes
        assert test_model.created_by == user
        assert test_model.updated_by == new_user


class TestActiveManager:

    @pytest.mark.django_db
    def test_active_manager_excludes_deleted(self, test_model):
        """Test that ActiveManager excludes soft-deleted objects"""
        # Ensure the object is initially returned by the default manager
        assert SampleBaseModel.objects.filter(id=test_model.id).exists()

        # Soft delete the object
        test_model.delete()

        # Ensure the object is excluded by the default manager
        assert not SampleBaseModel.objects.filter(id=test_model.id).exists()

        # Ensure the object is still returned by all_objects
        assert SampleBaseModel.all_objects.filter(id=test_model.id).exists()

    @pytest.mark.django_db
    def test_active_manager_includes_active(self, test_model):
        """Test that ActiveManager includes only active objects"""
        # Ensure the object is returned by the default manager
        assert SampleBaseModel.objects.filter(id=test_model.id).exists()

        # Ensure the object is also returned by all_objects
        assert SampleBaseModel.all_objects.filter(id=test_model.id).exists()

    @pytest.mark.django_db
    def test_restore_includes_in_active_manager(self, test_model):
        """Test that restoring a soft-deleted object includes it in ActiveManager"""
        # Soft delete the object
        test_model.delete()

        # Restore the object
        test_model.restore()

        # Ensure the object is included in the default manager again
        assert SampleBaseModel.objects.filter(id=test_model.id).exists()
