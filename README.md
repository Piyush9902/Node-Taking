Sure! Here’s a more natural, first-person rewrite of your README that sounds like you wrote it yourself, while keeping all the important details and setup steps:

---

# Notes App (React + Node + MongoDB)

This is a full-stack note-taking application I built with a React + TypeScript frontend and a Node.js + TypeScript backend using MongoDB.
It supports signup/login with **Email + OTP** or **Google Sign-In**, and lets users create and delete notes. All note APIs are protected using JWT.

---

## Tech Stack

* **Frontend:** React, Vite, TypeScript, React Query, Jotai, React Router
* **Backend:** Node.js (Express) with TypeScript, Mongoose (MongoDB)
* **Auth:** Email + OTP, Google Sign-In (Google Identity Services), JWT

---

## Project Structure

* `backend` – Express API
* `frontend` – React web app

---

## Prerequisites

* Node.js 18+
* A MongoDB database (Atlas or local)
* Google OAuth Client ID (Web) for the frontend
* SMTP credentials (only if you want real emails in dev/prod for OTP)

---

## Environment Variables

### Backend (`backend/.env`)

```
PORT=4000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
OTP_EXPIRE_MINUTES=10

FRONTEND_ORIGIN=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=optional_if_using_passport_strategy

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=secret
```

### Frontend (`frontend/.env`)

```
VITE_API_BASE=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

*Don’t commit real `.env` files.*

---

## Running Locally

1. Install dependencies:

   ```bash
   cd backend && npm i
   cd ../frontend && npm i
   ```

2. Create the `.env` files as shown above.

3. Start backend:

   ```bash
   cd backend
   npm run dev
   ```

4. Start frontend:

   ```bash
   cd frontend
   npm run dev
   ```

* Frontend runs at: **[http://localhost:5173](http://localhost:5173)**
* Backend runs at: **[http://localhost:4000](http://localhost:4000)**

---

## API Endpoints

* `POST /api/auth/send-otp` `{ name, email, dob? }`
* `POST /api/auth/verify-otp` `{ email, code, name?, dob? }` → `{ token, user }`
* `POST /api/auth/google` `{ idToken }` → `{ token, user }`
* `GET /api/notes` (Bearer token)
* `POST /api/notes` (Bearer token) `{ title, content }`
* `DELETE /api/notes/:id` (Bearer token)

---

## Frontend Notes

* Token is stored in `localStorage` and automatically attached by an Axios interceptor (`src/lib/api.ts`).
* Google login uses `@react-oauth/google` – remember to set `VITE_GOOGLE_CLIENT_ID`.
* Basic mobile-friendly styles are in `src/App.css`. Replace or enhance them with the provided design assets.

---

## Design Assets

Download the design files from the given link and place them under `frontend/public/`. Update CSS to closely match the provided design.

---

## Deployment

### Backend (Render example)

* Create a new Web Service from the `backend` folder
* Build command: `npm run build`
* Start command: `npm run start`
* Add environment variables from `.env`

### Frontend (Vercel/Netlify)

* Set `VITE_API_BASE` and `VITE_GOOGLE_CLIENT_ID` in environment settings
* Build command: `npm run build`
* Output dir: `dist`
* Make sure `FRONTEND_ORIGIN` in backend points to the deployed frontend URL

---

## Git Workflow

I commit after completing each feature with clear messages (scaffold, auth, notes, etc.).

---

## Security

* Use a strong JWT secret in production.
* Don’t expose OTP debug info.
* Configure SMTP for production emails.

---

## License

MIT

---

This version keeps it in a straightforward, personal voice while covering everything someone needs to set up, run, and deploy your project.
