# PulseBet

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Jayswizz-design/pulsebet)`r`n`r`nPulseBet is a React + Node.js sports betting interface with:
- Tailwind CSS frontend
- React Router pages for sportsbook, login, register, and virtual games
- MongoDB persistence with Mongoose
- `bcryptjs` password hashing
- `jsonwebtoken` auth sessions
- Paystack deposit initialization
- Live sports feed support with fallback local fixtures

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, Mongoose
- Auth: JWT + bcryptjs
- Payments: Paystack initialize transaction API
- Data: MongoDB, TheSportsDB live feed fallback

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill in:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL`
- `SPORTSDB_API_KEY`

3. Start the app:

```bash
npm run dev
```

## Production build

```bash
npm run build
npm start
```

## Auth flow

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Passwords are hashed with `bcryptjs`.
JWTs are required for wallet deposit initialization.

## Paystack

The backend initializes Paystack transactions at:

- `POST /api/payments/paystack/initialize`

Required server env:
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL`

## MongoDB

The backend connects through Mongoose.
Required env:
- `MONGODB_URI`
- `MONGODB_DB_NAME`

## Vercel frontend deploy

This repo includes [vercel.json](./vercel.json).

Recommended Vercel environment variable:
- `VITE_API_URL=https://pulsebet-api.onrender.com`

A production default is also provided in [client/.env.production](./client/.env.production).

Deploy flow:

```bash
overcel
```

If using the dashboard instead of CLI:
- Import the repo
- Set the root to the repo root
- Confirm build command: `npm run build --workspace client`
- Confirm output directory: `client/dist`
- Set `VITE_API_URL`

## Render backend deploy

This repo includes [render.yaml](./render.yaml).

Render service settings:
- Build command: `npm install`
- Start command: `npm run start --workspace server`

Required Render env vars:
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL`
- `SPORTSDB_API_KEY`

Expected backend URL:
- `https://pulsebet-api.onrender.com`

## GitHub push

This workspace is now initialized as a git repo. To publish it:

```bash
git remote add origin <your-repo-url>
git push -u origin main
```

## Notes

- If TheSportsDB live feed is unavailable, the app falls back to seeded local fixtures.
- `server/data/users.json` is ignored and no longer used for auth persistence.
- Vercel, Render, and GitHub CLI deployment still require your own authenticated account/session on this machine.

