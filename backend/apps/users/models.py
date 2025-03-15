from django.db import models  # noqa: F401
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    last_login_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    last_login_user_agent = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def delete(self, *args, **kwargs):
        if self.is_deleted:
            return
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def erase(self, *args, **kwargs):
        super().delete(*args, **kwargs)

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save()
