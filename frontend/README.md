# Travel Stream Frontend

The frontend is built with Node v22, Vite v6, and React v19.

## Set up

Follow the steps below to set up a development environment. This guide was tested using macOS Sequoia 15.3 on Apple Silicon with `zsh` and Docker Desktop.

```bash
# Make sure you are in the parent directory.
cd ../

# Build the image and run the container
docker compose up frontend

# Install development dependencies
docker compose exec frontend npm install
```

## Usage

### Run linter

```bash
docker compose exec frontend npm run lint
```
