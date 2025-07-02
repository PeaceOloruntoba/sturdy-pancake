import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./index.css";
import App from "./App.tsx";

const id = import.meta.env.VITE_PAYPAL_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PayPalScriptProvider
      options={{
        clientId: id,
        components: "buttons,card-fields",
        intent: "authorize",
        vault: true,
      }}
    >
      <App />
    </PayPalScriptProvider>
  </StrictMode>
);
