"""
URL configuration for travel_stream project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from apps.core.views import test_post, get_csrf_token
from apps.users.views import login_view, logout_view
from apps.trips.views import TripViewSet

router = DefaultRouter()
router.register(r"trips", TripViewSet, basename="trip")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("csrf/", get_csrf_token, name="get_csrf_token"),
    path("users/login/", login_view, name="login"),
    path("users/logout/", logout_view, name="logout"),
    path(
        "health_check/",
        lambda request: JsonResponse({"status": "ok"}),
        name="health_check",
    ),
    path("test_post/", test_post, name="test_post"),
]

urlpatterns += router.urls
