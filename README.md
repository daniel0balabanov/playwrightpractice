# Playwright Test Suite

A full-stack microservices application with a comprehensive Playwright test suite covering API, UI, and integration testing.

## Architecture

| Service | Port | Description |
|---|---|---|
| Frontend | 3000 | React-based web UI |
| User Service | 3001 | Authentication & user management (Express.js + JWT) |
| Items Service | 3002 | Todo/item CRUD API (Express.js) |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (for running tests)

## Getting Started

### 1. Start the services

```bash
docker compose up -d
```

### 2. Install test dependencies

```bash
cd tests
npm install
npx playwright install
```

### 3. Run the tests

```bash
# All tests
npm test

# API tests only
npm run test:api

# UI tests only
npm run test:ui

# Integration tests only
npm run test:integration
```

### 4. View the report

```bash
npx playwright show-report
```

## Project Structure

```
.
├── docker-compose.yml
├── .env                        # JWT_SECRET for local dev
├── frontend/                   # Static React app
├── user-service/               # Auth API
├── items-service/              # Items API
└── tests/
    ├── playwright.config.ts
    ├── api/
    │   ├── user-service/       # Auth, profile, error tests
    │   └── items-service/      # CRUD, filter, error tests
    ├── ui/                     # Forms, tables, navigation, overlays, etc.
    ├── integration/            # End-to-end user flows
    └── fixtures/               # Reusable auth & items setup/teardown
```

## Test Projects

| Project | Browser | Base URL |
|---|---|---|
| `api` | — | http://localhost:3001 |
| `ui` | Chromium | http://localhost:3000 |
| `integration` | Chromium | http://localhost:3000 |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `JWT_SECRET` | `playwright-dev-secret` | Secret used to sign JWT tokens |

Defined in `.env`, consumed by `user-service`.
