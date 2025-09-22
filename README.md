# Project Documentation

This repository contains the frontend for a production React application built with Vite and TypeScript. The backend (Node.js/Express) powers authentication, chat, photo management (Cloudinary), email notifications (Brevo), and payments (PayPal). Stripe is present in the codebase but not used in production per client request.

Use the docs below for a quick overview. Detailed references are available under the `docs/` folder.

## Overview

Frontend stack:
- React 19 + TypeScript + Vite (`package.json` scripts: `dev`, `build`, `preview`)
- React Router 7 for routing
- Tailwind CSS 4 for styling
- Zustand for state management
- Axios with an interceptor for auth (`src/utils/api.ts`)
- Socket.IO client for realtime chat
- PayPal JS SDK for payments

Backend stack (separate service):
- Node.js + Express
- MongoDB
- JWT auth
- Socket.IO server for chat
- Cloudinary for asset storage
- Brevo (Sendinblue) for email notifications
- PayPal for payments (Stripe libraries present but disabled)

## Key Features

- Authentication and Profiles
  - Register/Login via `/api/v1/auth/register` and `/api/v1/auth/login` (`src/store/useAuthStore.ts`)
  - Persisted auth with Bearer token auto-attached via Axios interceptor (`src/utils/api.ts`)

- Photo Management (Cloudinary-backed)
  - Upload/Delete photos: `/api/v1/photos`, `/api/v1/photos/upload`, `/api/v1/photos/:id`
  - Photo access requests and responses (`src/store/usePhotoStore.ts`)

- Realtime Chat (Socket.IO)
  - Conversations and messages: `/api/v1/chats`, `/api/v1/chats/messages/:otherUserId`, POST `/api/v1/chats/messages` (`src/store/useChatStore.ts`)
  - Socket events: `join`, `newMessage`, `messageRead`

- Payments (PayPal)
  - PayPal client integration present in frontend (`@paypal/react-paypal-js`)
  - Stripe keys are present for potential future use, but Stripe is not used in production

- Admin and User Guards
  - Route protection implemented in `guard/admin.guard.tsx` and `guard/user.guard.tsx`

## Environment Variables

Frontend (`.env` in project root):
- `VITE_API_URL` – Base URL of backend API (example: `http://localhost:8080`)
- `VITE_PAYPAL_CLIENT_ID` – PayPal client ID
- `VITE_STRIPE_PUBLIC_KEY` – Optional; not used in production currently

See `docs/ENV.md` for the full list and notes.

## API Summary

From the frontend code, the app calls these endpoints:
- Auth: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- Photos: `GET /api/v1/photos`, `POST /api/v1/photos/upload`, `DELETE /api/v1/photos/:photoId`
- Photo Requests: `POST /api/v1/photos/request`,
  `GET /api/v1/photos/requests/sent`,
  `GET /api/v1/photos/requests/received`,
  `PUT /api/v1/photos/requests/:requestId/respond`
- Profiles: `GET /api/v1/users/profile/:userId`
- Chat: `GET /api/v1/chats`, `GET /api/v1/chats/messages/:otherUserId`,
  `POST /api/v1/chats/messages`, `POST /api/v1/chats/messages/read`

Realtime (Socket.IO client at `VITE_API_URL`):
- Emits: `join`, `newMessage`, `messageRead`
- Listens: `newMessage`, `messageRead`

See `docs/API.md` for request/response details and example payloads.

## Local Development

Prerequisites: Node 18+, PNPM/NPM, a running backend API, and configured `.env`.

1) Install deps
```bash
npm install
```

2) Set env in `.env`
```bash
VITE_API_URL=http://localhost:8080
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
# VITE_STRIPE_PUBLIC_KEY=optional
```

3) Start dev server
```bash
npm run dev
```

The app will be available at the host/port Vite prints. The `vercel.json` rewrite serves SPA routes correctly on Vercel.

## Build & Deploy

- Build: `npm run build` → static assets under `dist/`
- Preview: `npm run preview`
- Deploy: Vercel (recommended for frontend). Backend should be deployed separately (e.g., Render/Railway/EC2) and `VITE_API_URL` pointed to it.

## Project Structure (selected)

- `src/utils/api.ts` – Axios instance with auth header interceptor
- `src/store/useAuthStore.ts` – Auth state and actions
- `src/store/useChatStore.ts` – Chat state, API calls, socket wiring
- `src/store/usePhotoStore.ts` – Photos and access requests
- `src/guard/*.tsx` – Route guards
- `src/layout/*.tsx` – Layout components
- `src/pages/*` – Pages (including subscription/payment flow)

## Security & Compliance Notes

- JWT tokens are stored with Zustand persistence; interceptor sets `Authorization: Bearer <token>` on requests.
- All file uploads occur via the backend (`/api/v1/photos/upload`), which handles Cloudinary.
- Payments: Only PayPal is active in production. Stripe keys are present but not used.
- Emails are sent server-side via Brevo.

## Troubleshooting

- 401 errors: Ensure token exists; re-login (`useAuthStore.login`) and verify backend CORS & JWT secret.
- Socket not connecting: Check `VITE_API_URL` and backend Socket.IO path (`/socket.io/`).
- Uploads failing: Verify Cloudinary credentials on the backend and multipart handling.
## Further Docs

- See `docs/ARCHITECTURE.md` for diagrams and data flow.
- See `docs/API.md` for endpoints and payloads.
- See `docs/ENV.md` for environment setup.
