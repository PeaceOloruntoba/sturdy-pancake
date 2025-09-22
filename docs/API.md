# API Reference

This document reflects the endpoints consumed by the frontend based on the code in `src/store/*` and pages. Adjust to match your backend if routes differ.

Base URL: `${VITE_API_URL}` (e.g., `http://localhost:8080`)

Auth header: `Authorization: Bearer <JWT>` for protected routes.

## Auth

- POST `/api/auth/register`
  - Body (example):
    ```json
    {
      "email": "user@example.com",
      "password": "string",
      "firstName": "John",
      "lastName": "Doe",
      "age": 20,
      "gender": "male",
      "university": "Uni",
      "isStudent": true,
      "isGraduate": false,
      "description": "...",
      "lookingFor": "...",
      "guardianEmail": "optional",
      "guardianPhone": "optional"
    }
    ```
  - Response (example):
    ```json
    {
      "token": "<jwt>",
      "userId": "<id>",
      "isAdmin": false,
      "hasActiveSubscription": false
    }
    ```

- POST `/api/auth/login`
  - Body: `{ "email": string, "password": string }`
  - Response: `{ "token": string, "userId": string, ...userFields }`

- POST `/api/auth/subscribe` (PayPal)
  - Body:
    - Step 1 (create subscription): `{ "paymentProcessor": "paypal" }`
    - Step 2 (finalize): `{ "paymentProcessor": "paypal", "paypalSubscriptionId": "<id>" }`
  - Response (step 1): `{ "subscriptionId": "<paypal_subscription_id>" }`
  - Response (step 2): `{ "success": true }` and frontend sets subscription state.

## Photos

- GET `/api/photos`
  - Response (example):
    ```json
    [
      {
        "_id": "photoId",
        "userId": "userId",
        "cloudinaryUrl": "https://...",
        "cloudinaryPublicId": "...",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
    ```

- POST `/api/photos/upload`
  - Content-Type: `multipart/form-data`
  - Field: `image` (File)
  - Response: `{ "photo": { ... } }`

- DELETE `/api/photos/:photoId`
  - Response: `{ "success": true }`

### Photo Access Requests

- POST `/api/photos/request`
  - Body: `{ "targetUserId": "<id>" }`
  - Response: `{ "request": { _id, requesterId, targetUserId, status, ... } }`

- GET `/api/photos/requests/sent`
  - Response: `PhotoRequest[]`

- GET `/api/photos/requests/received`
  - Response: `PhotoRequest[]`

- PUT `/api/photos/requests/:requestId/respond`
  - Body: `{ "status": "accepted" | "rejected" }`
  - Response: `{ "request": { ...updated } }`

## Profiles

- GET `/api/users/profile/:userId`
  - Response (example):
    ```json
    {
      "_id": "userId",
      "firstName": "Jane",
      "lastName": "Doe",
      "age": 21,
      "gender": "female",
      "university": "Uni",
      "status": "...",
      "description": "...",
      "lookingFor": "...",
      "photos": [{ "id": "...", "url": "https://..." }],
      "photoAccessStatus": "restricted|pending|accepted|rejected|granted_self|granted_by_request"
    }
    ```

## Chat

- GET `/api/chats`
  - Response: `Chat[]` with `{ id, user: { id, firstName, lastName }, lastMessage, timestamp }`

- GET `/api/chats/messages/:otherUserId`
  - Response: `Message[]` with `{ _id, senderId, receiverId, content, timestamp, status? }`

- POST `/api/chats/messages`
  - Body: `{ "receiverId": "<id>", "content": "..." }`
  - Response: `Message`

- POST `/api/chats/messages/read`
  - Body: `{ "messageId": "<id>", "readerId": "<id>" }`
  - Response: `{ "success": true }`

## Realtime (Socket.IO)

- Connection: `io(VITE_API_URL, { path: "/socket.io/" })`
- Emits:
  - `join` with payload: `userId`
  - `newMessage` with: `Message`
  - `messageRead` with: `{ messageId, readerId, senderId }`
- Listens:
  - `newMessage` -> Message appended; if from self, status set to `delivered`
  - `messageRead` -> Updates message status to `read`
