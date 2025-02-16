# Generated by Django 5.1.3 on 2024-11-15 17:59

import storages.backends.s3
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Agency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('agency_legal_name', models.CharField(max_length=255)),
                ('agency_display_name', models.CharField(max_length=255)),
                ('agency_slug', models.SlugField(unique=True)),
                ('address', models.CharField(max_length=255)),
                ('address2', models.CharField(blank=True, max_length=255, null=True)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=100)),
                ('zip', models.CharField(max_length=20)),
                ('country', models.CharField(max_length=100)),
                ('logo', models.ImageField(blank=True, null=True, storage=storages.backends.s3.S3Storage(), upload_to='agency_logos/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'agencies',
                'ordering': ['agency_display_name'],
            },
        ),
    ]
