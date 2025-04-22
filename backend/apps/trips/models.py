from django.db import models

import apps.core.models


class Trip(apps.core.models.BaseModel):
    """
    Trip model to store basic trip information.
    """

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    destination = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name
