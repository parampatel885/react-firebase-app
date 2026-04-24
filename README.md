# Play Pal — Connect Through Sports

> A full-stack web platform for finding and joining local sports teams based on your location, time, and sport preference.

🔗 **Live demo:** https://playpal-9b5e9.web.app/

---

## What it does

Play Pal lets users create sports teams, browse nearby teams by sport and location, and join them — all in real time. The platform handles team membership securely with authentication and fine-grained database permission rules so only the right people can manage the right teams.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript, CSS3 |
| Backend / Database | Firebase Firestore (real-time) |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |
| Cloud | Google Cloud infrastructure |

---

## Key features

- **Team creation** — set sport, location, max members, and description
- **Browse & filter** — search teams by name, sport, or location in real time
- **Authentication** — secure sign-in with role-based access control
- **Database permissions** — fine-grained Firestore security rules to protect team membership data
- **Responsive UI** — works on desktop, tablet, and mobile
- **CI/CD pipeline** — GitHub Actions auto-deploys on every push to main

---

## Architecture highlights

- Firestore security rules enforce that only team creators can edit or delete teams
- Real-time listeners update the team list without page refreshes
- Authentication state is managed globally and persists across sessions
- Deployed via Firebase Hosting with a GitHub Actions workflow for continuous delivery

---

## Run locally

```bash
git clone https://github.com/parampatel885/react-firebase-app
cd react-firebase-app/my-react-app
npm install
npm run dev
```

Open `http://localhost:5173`

---

## What I learned

- Designing backend permission systems that scale (Firestore security rules)
- Integrating real-time data with React state management
- Setting up CI/CD pipelines with GitHub Actions for automatic cloud deployments
- Full-stack ownership: from UI to auth to cloud infrastructure

---

Built by [Param Patel](https://github.com/parampatel885)
