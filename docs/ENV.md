# Environment Configuration

This app uses Vite, so frontend env vars must be prefixed with `VITE_`.

## Frontend (.env)

Example `.env` file in the project root:

```
VITE_API_URL=http://localhost:8080
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
# Optional; present for future use but not active in production
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

Notes:
- `VITE_API_URL` must point to your backend base URL and is used by `src/utils/api.ts` and Socket.IO.
- `VITE_PAYPAL_CLIENT_ID` is used by `PayPalScriptProvider` in `src/main.tsx`.
- Stripe is not used in production per client request, but the SDK is wired; you can remove these if desired.

## Backend (server-side env)

Set on your backend hosting provider (not committed to this repo):

```
PORT=8080
MONGODB_URI=mongodb+srv://...
JWT_SECRET=supersecret
CORS_ORIGIN=https://your-frontend-domain

# Email (Brevo)
BREVO_API_KEY=...
BREVO_SENDER=no-reply@yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=live # or sandbox
```

Recommendations:
- Enforce HTTPS in production so JWTs are transmitted securely.
- Set proper CORS to only allow your production frontend origin.
- Rotate keys periodically and keep them out of the client bundle.
