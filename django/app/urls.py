"""
URL configuration for app project.

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
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.http import JsonResponse
import json
from django.core.exceptions import ValidationError
from app.models.reservation import Reservation

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({})

@csrf_protect
@require_http_methods(["POST"])
def reserve(request):
    try:
        data = json.loads(request.body)
        try:
            data['traveling_from'] = data.pop('from')
            data['departure_date'] = data.pop('departureDate')
            data['return_date'] = data.pop('returnDate')
            data['children'] = data.get('children', 0)
            data['infants'] = data.get('infants', 0)
            reservation = Reservation.objects.create(**data)
            return JsonResponse({
                'message': 'Reservation created successfully',
                'id': reservation.id
            }, status=201)
        except ValidationError as e:
            return JsonResponse({'errors': e.message_dict}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('reserve/', reserve, name='reserve'),
]
