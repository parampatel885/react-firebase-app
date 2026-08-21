# PlayPal API

Express + TypeScript backend with JWT authentication.

## Setup

```bash
cp .env.example .env   # set JWT_SECRET
npm run dev
```

Runs at [http://localhost:4000](http://localhost:4000).

## Auth endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Create account → returns JWT |
| POST | `/auth/login` | No | Sign in → returns JWT |
| POST | `/auth/firebase` | No | Exchange Firebase ID token → returns JWT |
| POST | `/auth/google` | No | Alias of `/auth/firebase` |
| GET | `/auth/me` | Bearer JWT | Current user profile |

## Protected routes

All routes under `/api/*` require a valid `Authorization: Bearer <token>` header.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/profile` | Example protected route |

## JWT middleware

The `authenticate` middleware in `src/middleware/auth.middleware.ts`:

1. Reads the `Authorization` header
2. Verifies the JWT signature and expiry
3. Loads the user and attaches it to `req.user`
4. Returns `401` if the token is missing, invalid, or expired

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | dev fallback | Secret for signing tokens (required in production) |
| `JWT_EXPIRES_IN` | `25m` | Token lifetime (frontend refreshes every 20 minutes) |
| `PORT` | `4000` | Server port |
| `CORS_ORIGIN` | all origins | Allowed frontend origin |
| `FIREBASE_PROJECT_ID` | `playpal-9b5e9` | Firebase project used to verify Google sign-in |
