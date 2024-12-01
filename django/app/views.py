from django.core.exceptions import ValidationError
from app.models.reservation import Reservation
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.http import JsonResponse
import json
from app.serializers import ReservationSerializer
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics


@ensure_csrf_cookie
def get_csrf_token_view(request):
    return JsonResponse({})


class ReservationListView(generics.ListCreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
