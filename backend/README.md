# Travel Stream Backend

The backend is built with Python 3.13 and Django ~5.1.

## Set up

Follow the steps below to set up a development environment. This guide was tested using macOS Sequoia 15.3 on Apple Silicon with `zsh` and Docker Desktop.

```bash
# Make sure you are in the parent directory.
cd ../

# Build the image and run the container
docker compose up backend

# Install development dependencies
docker compose exec backend pip install -r requirements-dev.txt
```

## Usage

### Run tests

```bash
docker compose exec backend pytest
```

### Run linter

```bash
docker compose exec backend flake8
```

### Run formatter

```bash
docker compose exec backend black .
```
