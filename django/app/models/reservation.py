from django.db import models
from django.core.exceptions import ValidationError

class Reservation(models.Model):
    name = models.CharField(max_length=127)
    phone = models.CharField(max_length=31)
    email = models.EmailField()
    traveling_from = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    departure_date = models.DateField()
    return_date = models.DateField()
    adults = models.PositiveIntegerField()
    children = models.PositiveIntegerField()
    infants = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


    def clean(self):
        if self.return_date and self.departure_date:
            if self.return_date < self.departure_date:
                raise ValidationError({
                    'return_date': 'Return date must be after departure date'
                })

        if self.adults < 1:
            raise ValidationError({
                'adults': 'At least one adult is required'
            })

        if self.children < 0:
            raise ValidationError({
                'children': 'Number of children cannot be negative'
            })

        if self.infants < 0:
            raise ValidationError({
                'infants': 'Number of infants cannot be negative'
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.departure_date}"
