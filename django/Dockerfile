FROM python:3.11-slim

RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev

# Install dependencies for postgres
RUN apt-get update && apt-get install -y \
    libpq-dev gcc build-essential \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

WORKDIR /app

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
