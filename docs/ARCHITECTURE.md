# Architecture

This project consists of a React frontend (this repo) and a separate Node.js/Express backend.

## High-level Diagram

Frontend (Vite/React/TS)
- Routing: React Router
- State: Zustand stores
  - `useAuthStore` for auth
  - `useChatStore` for chat (sockets + REST)
  - `usePhotoStore` for photos and access requests
- API client: `src/utils/api.ts` (Axios with auth header)
- Realtime: Socket.IO client -> backend Socket.IO server
- Payments: PayPal SDK via `@paypal/react-paypal-js`
- Styling: Tailwind CSS

Backend (Node/Express)
- REST API endpoints under `/api/*`
- JWT authentication
- MongoDB persistence
- Socket.IO server for chat events
- Cloudinary for storing images
- Brevo for transactional emails
- PayPal for subscriptions/payments

## Frontend Data Flow

1. Auth
   - User registers/logs in via `useAuthStore.register/login` which POSTs to `/api/auth/*`.
   - On success, the JWT is stored (Zustand persist). Axios interceptor attaches `Authorization: Bearer <token>`.

2. Photos
   - `usePhotoStore` calls `/api/photos` to list.
   - Upload: `POST /api/photos/upload` with multipart form-data (file under key `image`).
   - Delete: `DELETE /api/photos/:photoId`.
   - Access requests: POST/GET/PUT under `/api/photos/requests/*`.

3. Chat
   - List chats: `GET /api/chats`.
   - Fetch conversation: `GET /api/chats/messages/:otherUserId`.
   - Send: `POST /api/chats/messages`.
   - Mark read: `POST /api/chats/messages/read`.
   - Socket events (client):
     - Emits: `join`, `newMessage`, `messageRead`.
     - Listens: `newMessage`, `messageRead`.
     - Socket connects to `VITE_API_URL` with path `/socket.io/`.

4. Payments
   - `PayPalScriptProvider` initialized in `src/main.tsx` with client ID and `intent: subscription`.
   - `Subscribe.tsx` renders `PayPalButtons`:
     - `createSubscription` calls backend `POST /api/auth/subscribe` with `{ paymentProcessor: "paypal" }`.
     - Backend returns `subscriptionId` which is passed to the PayPal SDK.
     - `onApprove` calls backend to finalize subscription and updates local `hasActiveSubscription`.
   - Stripe libraries exist but are commented out and not used in production.

## Deployment Topology

- Frontend: built with `npm run build` and deployed as a static SPA (e.g., Vercel). `vercel.json` rewrites all routes to `/` for client-side routing.
- Backend: deploy separately on render. Configure CORS to allow the frontend origin and expose Socket.IO at `/socket.io/`.
- Environment variables are injected at build/runtime (see `docs/ENV.md`).
