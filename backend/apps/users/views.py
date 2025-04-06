from django.contrib.auth import authenticate, logout
from django.shortcuts import render  # noqa: F401
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_safe
from django.http import HttpRequest, JsonResponse


@require_safe
def session_view(request: HttpRequest) -> JsonResponse:
    """
    Handle the request to check if a valid session exists.

    Args:
        request:
               The HTTP request object.
    Returns:
        JsonResponse:
            A JSON response indicating whether the user is authenticated.
    """
    status = 200 if request.user.is_authenticated else 401
    return JsonResponse({}, status=status)


@csrf_exempt
@require_POST
def login_view(request: HttpRequest) -> JsonResponse:
    """
    Handle the login request by verifying the Firebase ID token.

    Args:
        request:
            The HTTP request object containing the Authorization header.
    Returns:
        JsonResponse:
            A JSON response indicating success or failure.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "Bad request"}, status=400)

    firebase_token = auth_header.split(" ")[1]

    user = authenticate(request, firebase_token=firebase_token)
    if not user:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    return JsonResponse({"message": "Logged in successfully"})


@require_POST
def logout_view(request: HttpRequest) -> JsonResponse:
    """
    Handle the logout request.

    Args:
        request:
            The HTTP request object.
    Returns:
        JsonResponse:
            A JSON response indicating success.
    """
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})
