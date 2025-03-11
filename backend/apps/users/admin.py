from django.contrib import admin  # noqa: F401
from django.contrib.auth.admin import UserAdmin
from .models import User


admin.site.register(User, UserAdmin)
