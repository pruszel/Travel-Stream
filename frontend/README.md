# Travel Stream Frontend

The frontend is built with Node v22, Vite v6, and React v19.

## Set up

Follow the steps below to set up a development environment. This guide was tested using macOS Sequoia 15.3 on Apple Silicon with `zsh` and Docker Desktop.

```bash
# Make sure you are in the parent directory.
cd ../

# Build the image and run the container
docker compose up frontend

# Install dependencies
docker compose exec frontend npm install
```

## Usage

### Run tests

```bash
docker compose exec frontend npm run test
```

### Generate coverage report

```bash
docker compose exec frontend npm run coverage
```

### Run linter

```bash
docker compose exec frontend npm run lint
```

### Run formatter

```bash
docker compose exec frontend npm run prettier:fix
```

## Deployment

The frontend is deployed automatically from GitHub to Cloudflare Pages using the [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/).

Deployments are triggered when changes in the "build watch paths" are pushed to the `main` branch. The build watch paths are configured as follows:

- **Include:** `frontend/*`
- **Exclude:** `*.md`, `Dockerfile`, `.dockerignore`, `.gitignore`

For additional details on build watch paths, refer to the [Cloudflare docs](https://developers.cloudflare.com/pages/configuration/build-watch-paths/#build-watch-paths).

The build configuration root directory is `/frontend` and the build output directory is `dist`. The build command is `npm run build`.
