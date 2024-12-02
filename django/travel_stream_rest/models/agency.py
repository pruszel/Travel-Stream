from django.db import models
from django.utils.text import slugify
from storages.backends.s3boto3 import S3Boto3Storage

class Agency(models.Model):
    agency_legal_name = models.CharField(max_length=255)
    agency_display_name = models.CharField(max_length=255)
    agency_slug = models.SlugField(unique=True)
    address = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    logo = models.ImageField(
        storage=S3Boto3Storage(),
        upload_to='agency_logos/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.agency_slug:
            self.agency_slug = slugify(self.agency_display_name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "agencies"
        ordering = ['agency_display_name']

    def __str__(self):
        return self.agency_display_name
