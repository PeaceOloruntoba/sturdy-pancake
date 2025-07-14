import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./index.css";
import App from "./App.tsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const id = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <PayPalScriptProvider
        options={{
          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID!,
          components: "buttons,card-fields",
          intent: "subscription",
          vault: true,
        }}
      >
        <App />
      </PayPalScriptProvider>
    </Elements>
  </StrictMode>
);
