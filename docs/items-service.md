# Items Service

An Express.js REST API that manages todo/task items. Runs on port **3002**.

## Stack

- **Express.js** — HTTP server
- **jsonwebtoken** — JWT verification (shares the same secret as user-service)
- **uuid** — ID generation
- **CORS** enabled for all origins (development setup)

## Storage

In-memory only. Items are stored in a `Map` and seeded with 12 example records on startup. All data is lost on restart.

### Seed data

| Title | Category | Done |
|---|---|---|
| Buy groceries | shopping | false |
| Read Playwright docs | learning | false |
| Morning run | health | true |
| Finish project report | work | false |
| Call dentist | health | false |
| Learn TypeScript | learning | false |
| Weekly review | work | true |
| Buy birthday gift | shopping | false |
| Meditate | personal | true |
| Fix login bug | work | false |
| Cook dinner | personal | false |
| Read novel | personal | false |

### Item schema

```json
{
  "id": "uuid",
  "title": "string",
  "category": "work | personal | shopping | health | learning",
  "done": false,
  "createdAt": "ISO 8601 timestamp",
  "userId": "uuid of creator (or 'seed' for seeded items)"
}
```

## Categories

Fixed list: `work`, `personal`, `shopping`, `health`, `learning`

Available via `GET /items/categories`.

## Endpoints

All endpoints require `Authorization: Bearer <token>`.

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Returns `{ status: "ok", service: "items-service" }` |

### Items — `/items`

| Method | Path | Description |
|---|---|---|
| GET | `/items` | List items with filtering, sorting, and pagination |
| POST | `/items` | Create a new item |
| GET | `/items/:id` | Get a single item |
| PUT | `/items/:id` | Update an item |
| DELETE | `/items/:id` | Delete an item |
| POST | `/items/:id/toggle` | Toggle the `done` status |
| GET | `/items/categories` | List all valid categories |

### GET `/items` — query parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `category` | string | — | Filter by category |
| `done` | `true` \| `false` | — | Filter by completion status |
| `search` | string | — | Case-insensitive substring match on `title` |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |
| `sortBy` | string | `createdAt` | Field to sort by |
| `order` | `asc` \| `desc` | `desc` | Sort direction |

Response shape:
```json
{
  "data": [ ...items ],
  "meta": { "page": 1, "limit": 10, "total": 12, "totalPages": 2 }
}
```

### POST `/items`

```json
{ "title": "Buy milk", "category": "shopping" }
```

- `title` and `category` are required
- `done` defaults to `false`
- Returns `201` with the created item
- Returns `400` if fields are missing or category is invalid

### PUT `/items/:id`

Partial update — only provided fields are changed.

```json
{ "title": "Updated title", "done": true }
```

- Returns `404` if item not found
- Returns `400` if category is invalid

### POST `/items/:id/toggle`

Flips `done` from `true` → `false` or `false` → `true`. Returns the updated item.

## Authentication middleware

Identical in structure to user-service's `requireAuth`. Verifies the JWT and attaches `req.user` (contains `{ userId }`). Note: items-service does **not** look up the full user record — it only validates the token payload.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3002` | Port to listen on |
| `JWT_SECRET` | `playwright-dev-secret` | Must match the value used by user-service |
