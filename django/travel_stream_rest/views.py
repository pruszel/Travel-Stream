from django.core.exceptions import ValidationError
from travel_stream_rest.models.reservation import Reservation
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.http import JsonResponse
from travel_stream_rest.serializers import ReservationSerializer
from rest_framework import generics


@ensure_csrf_cookie
def get_csrf_token_view(request):
    return JsonResponse({})


class ReservationListView(generics.ListCreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
