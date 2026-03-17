# User Service

An Express.js REST API that handles user registration, authentication, and profile management. Runs on port **3001**.

## Stack

- **Express.js** — HTTP server
- **jsonwebtoken** — JWT signing and verification
- **bcryptjs** — password hashing
- **uuid** — ID generation
- **CORS** enabled for all origins (development setup)

## Storage

In-memory only. All users are stored in a `Map` (`users`) and lost on restart. There is no database.

A `tokenBlacklist` `Set` stores revoked tokens (logout). It is also in-memory.

## Endpoints

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Returns `{ status: "ok", service: "user-service" }` |

### Auth — `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Create a new account |
| POST | `/auth/login` | No | Log in with email + password |
| POST | `/auth/logout` | Yes | Blacklist the current token |

#### POST `/auth/register`

Request body:
```json
{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }
```

- Returns `201` with `{ token, user }` on success
- Returns `400` if any field is missing
- Returns `409` if the email is already registered
- Passwords are hashed with bcrypt before storage
- `passwordHash` is never returned in responses

#### POST `/auth/login`

Request body:
```json
{ "email": "alice@example.com", "password": "secret123" }
```

- Returns `200` with `{ token, user }` on success
- Returns `400` if fields are missing
- Returns `401` if credentials are invalid (same message for both "user not found" and "wrong password" to avoid user enumeration)

#### POST `/auth/logout`

Requires `Authorization: Bearer <token>` header.

- Adds the token to the blacklist
- Returns `204 No Content`

### Users — `/users`

All routes require `Authorization: Bearer <token>`.

| Method | Path | Description |
|---|---|---|
| GET | `/users/me` | Get the authenticated user's profile |
| PUT | `/users/me` | Update name and/or email |
| PUT | `/users/me/password` | Change password |
| DELETE | `/users/me` | Delete account and revoke token |

#### PUT `/users/me`

```json
{ "name": "New Name", "email": "new@example.com" }
```

- Returns `409` if the new email is already taken by another user
- Only provided fields are updated

#### PUT `/users/me/password`

```json
{ "currentPassword": "old", "newPassword": "new123" }
```

- Returns `401` if `currentPassword` does not match

#### DELETE `/users/me`

- Blacklists the current token and deletes the user record
- Returns `204 No Content`

## Authentication middleware (`requireAuth`)

Applied to all protected routes. It:

1. Reads the `Authorization` header
2. Rejects tokens present in the `tokenBlacklist`
3. Verifies the JWT signature using `JWT_SECRET` (from environment, defaults to `playwright-dev-secret`)
4. Looks up the user by `userId` from the token payload
5. Attaches `req.user` and `req.token` for downstream handlers

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Port to listen on |
| `JWT_SECRET` | `playwright-dev-secret` | Secret used to sign/verify JWTs |
