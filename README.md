Notes App (React + Node + MongoDB)
==================================

A full-stack note-taking application with Email+OTP and Google login. Users can create and delete notes. JWT is used for API authorization.

Tech Stack
---------
- Frontend: React + Vite + TypeScript, React Query, Jotai, React Router
- Backend: Node.js (Express) + TypeScript, Mongoose (MongoDB)
- Auth: Email + OTP, Google Sign-In (Google Identity Services), JWT

Monorepo Layout
---------------
- `backend`: Express API
- `frontend`: React web app

Prerequisites
-------------
- Node.js 18+
- A MongoDB database (Atlas or local)
- Google OAuth Client ID (Web) for `frontend`
- SMTP credentials (optional in dev) for sending OTPs

Environment Variables
---------------------

Backend (`backend/.env`)
```
PORT=4000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
OTP_EXPIRE_MINUTES=10

# CORS frontend origin
FRONTEND_ORIGIN=http://localhost:5173

# Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=optional_if_using_passport_strategy

# SMTP (optional for dev; logs fallback if not working)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=secret
```

Frontend (`frontend/.env`)
```
VITE_API_BASE=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Note: Do not commit real `.env` files.

Local Development
-----------------

1) Install dependencies
```
cd backend && npm i
cd ../frontend && npm i
```

2) Setup environment files as shown above

3) Run backend
```
cd backend
npm run dev
```

4) Run frontend
```
cd frontend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

API Summary
-----------
- `POST /api/auth/send-otp` { name, email, dob? }
- `POST /api/auth/verify-otp` { email, code, name?, dob? } → { token, user }
- `POST /api/auth/google` { idToken } → { token, user }
- `GET /api/notes` (Bearer token)
- `POST /api/notes` (Bearer token) { title, content }
- `DELETE /api/notes/:id` (Bearer token)

Frontend Notes
--------------
- Token is stored in `localStorage` and attached via Bearer header by an axios interceptor (`src/lib/api.ts`).
- Google login uses `@react-oauth/google`. Set `VITE_GOOGLE_CLIENT_ID`.
- Basic mobile-friendly styles in `src/App.css`. Replace with provided assets/design from the link.

Design Assets
-------------
Download assets from the provided link and place them under `frontend/public/` and import as needed. Update CSS to match the design closely.

Deployment
----------

You can deploy with any provider. Two easy paths:

- Render (Backend):
  - Create a new Web Service from `backend`.
  - Build command: `npm run build`
  - Start command: `npm run start`
  - Add env vars from `.env`.

- Vercel/Netlify (Frontend):
  - Set environment variables (`VITE_API_BASE`, `VITE_GOOGLE_CLIENT_ID`).
  - Build command: `npm run build`, Output dir: `dist`.
  - Ensure CORS in backend `FRONTEND_ORIGIN` points to the deployed frontend URL.

Git Workflow
------------
- Commit after each feature with clear messages (done so far for scaffold, auth UI, notes UI skeleton).

Security
--------
- JWT secret must be strong and stored securely.
- In production, disable OTP debug info and ensure SMTP is configured.

License
-------
MIT

