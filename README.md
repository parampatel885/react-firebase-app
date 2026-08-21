# PlayPal

Connect through sports — create teams, browse listings, and join games.

## Monorepo layout

```
PlayPal/
├── apps/
│   ├── web/          # Frontend (Vite + React + Firebase)
│   └── api/          # Backend (Express + TypeScript)
├── firebase.json     # Firebase Hosting config
├── package.json      # Workspace root
└── .github/workflows/
```

## Prerequisites

- Node.js 18+
- npm 9+

## Development

From the repo root:

```bash
npm install

# Frontend only (http://localhost:5173)
npm run dev:web

# API only (http://localhost:4000)
npm run dev:api
```

## Build & deploy

```bash
npm run build        # Builds apps/web → apps/web/dist
```

Firebase Hosting deploys from `apps/web/dist`. CI runs `npm ci && npm run build` on merge to `main`.

Publish Firestore rules after changing `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

In Firebase Console, enable **Google** and **Email/Password** under Authentication → Sign-in method.

## Apps

| App | Path | Stack | Purpose |
|-----|------|-------|---------|
| **web** | `apps/web` | Vite, React, Firebase | Main user-facing app |
| **api** | `apps/api` | Express, TypeScript | REST API (auth stub) |
