# Travel Stream Backend

The backend is built with Python 3.13 and Django ~5.1.

## Set up

Follow the steps below to set up a development environment. This guide was tested using macOS Sequoia 15.3 on Apple Silicon with `zsh` and Docker Desktop.

```bash
# Make sure you are in the backend directory, the same one this file is in.
cd backend

# Build the image
docker build -t travel-stream-backend .

# Run the container
docker run -d -p 8000:8000 -v $(pwd):/app --name travel-stream-backend travel-stream-backend

# Install development dependencies
docker exec travel-stream-backend pip install -r requirements-dev.txt
```

## Usage

### Run tests

```bash
docker exec travel-stream-backend pytest
```

### Run linter

```bash
docker exec travel-stream-backend flake8
```

### Run formatter

```bash
docker exec travel-stream-backend black .
```
