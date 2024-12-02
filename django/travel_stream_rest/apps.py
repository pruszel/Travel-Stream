from django.apps import AppConfig


class TravelStreamRestConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'travel_stream_rest'

    def ready(self):
        pass
