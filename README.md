# Play Pal — Connect Through Sports

> A full-stack web platform for finding and joining local sports teams based on your location, time, and sport preference.

🔗 **Live demo:** https://playpal-9b5e9.web.app/

---

## Monorepo Layout

```text
PlayPal/
├── apps/
│   ├── web/          # Frontend (Vite + React + Firebase)
│   └── api/          # Backend (Express + TypeScript)
├── firebase.json     # Firebase Hosting config
├── package.json      # Workspace root
└── .github/workflows/
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript, CSS3 |
| Backend / Database | Firebase Firestore (real-time) |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |
| Cloud | Google Cloud infrastructure |

---

## Key Features

- **Team creation** — set sport, location, max members, and description.
- **Browse & filter** — search teams by name, sport, or location in real time.
- **My Teams** — manage and edit your created teams via an inline slide-out drawer from the left.
- **Joined Teams** — view all the sports communities you have joined as a member.
- **Authentication** — secure sign-in with role-based access control.
- **Database permissions** — fine-grained Firestore security rules to protect team membership data.
- **Responsive UI** — works on desktop, tablet, and mobile.
- **CI/CD pipeline** — GitHub Actions auto-deploys on every push to main.

---

## Prerequisites

- Node.js 18+
- npm 9+

---

## Run Locally

From the repo root:

```bash
npm install

# Frontend only (http://localhost:5174)
npm run dev:web

# API only (http://localhost:4000)
npm run dev:api
```

---

## Build & Deploy

```bash
npm run build        # Builds apps/web → apps/web/dist
```

Firebase Hosting deploys from `apps/web/dist`. CI/CD runs `npm ci && npm run build` on merge to `main`.

Publish Firestore rules after changing `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

---

## What I Learned

- Designing backend permission systems that scale (Firestore security rules).
- Integrating real-time data with React state management.
- Setting up CI/CD pipelines with GitHub Actions for automatic cloud deployments.
- Full-stack ownership: from UI to auth to cloud infrastructure.

---

Built by [Param Patel](https://github.com/parampatel885)
