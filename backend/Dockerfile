# This Dockerfile is used for deployment to Fly.io
FROM python:3.13-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV DJANGO_SETTINGS_MODULE=travel_stream.settings

WORKDIR /app

# Add build dependencies for psycopg
RUN apk update && apk add --no-cache \
    build-base \
    postgresql-dev \
    && rm -rf /var/cache/apk/*

# Install dependencies
COPY requirements.txt /tmp/requirements.txt
RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    pip install gunicorn

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "travel_stream.wsgi"]
