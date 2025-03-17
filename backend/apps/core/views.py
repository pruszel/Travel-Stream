from django.shortcuts import render  # noqa: F401
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_safe
from django.middleware.csrf import get_token

@require_safe
def get_csrf_token(request):
    return JsonResponse({"csrf_token": get_token(request)})

@require_POST
def test_post(request):
    return JsonResponse({"message": "Hello, world!"})
