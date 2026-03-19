# CLAUDE.md

## Project Overview

Full-stack microservices app used as a Playwright testing playground. Three services (frontend, user-service, items-service) run via Docker Compose. Tests live in `tests/` and are entirely separate from the app code.

## Running the Stack

```bash
docker compose up -d        # start all services
docker compose down         # stop all services
docker compose logs -f      # follow logs
```

Services must be running before executing any tests.

## Running Tests

```bash
cd tests
npm test                    # all tests
npm run test:api            # API tests only
npm run test:ui             # UI tests only
npm run test:integration    # integration tests only
```

## Test Structure

- `tests/api/user-service/` — auth, profile, and error handling for user-service (port 3001)
- `tests/api/items-service/` — CRUD, filtering, auth, and error handling for items-service (port 3002)
- `tests/ui/` — browser-based UI tests (forms, tables, navigation, overlays, selects, advanced)
- `tests/integration/` — full user flows (register, login, manage items)
- `tests/fixtures/` — reusable Playwright fixtures that create/teardown test users and items

## Collaboration

Before implementing any idea or change the user proposes, think it through and share your thoughts, concerns, and suggestions first. Only proceed with implementation after discussing the approach.

## Key Conventions

- Fixtures in `tests/fixtures/` handle setup and teardown automatically — prefer them over manual API calls in tests.
- API tests use `request` context only (no browser). UI and integration tests use Chromium.
- The `playwright.config.ts` defines three named projects: `api`, `ui`, `integration`. Use `--project=<name>` to target one.
- JWT_SECRET is set in `.env` at the project root and injected into user-service via Docker Compose.

## Ports

| Service | Port |
|---|---|
| frontend | 3000 |
| user-service | 3001 |
| items-service | 3002 |
