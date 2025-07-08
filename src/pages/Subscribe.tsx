import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { Button } from "../components/Button";
import { PayPalButtons } from "@paypal/react-paypal-js";
import api from "../utils/api";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function SubscribePage() {
  const navigate = useNavigate();
  const { user, token, isLoading, setSubscriptionStatus } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "paypal" | "stripe"
  >("paypal");

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      toast.error("Please log in to subscribe.");
    }
  }, [user, token, navigate]);

  const handleSubscriptionSuccess = async (
    paymentId: string,
    processor: "paypal" | "stripe"
  ) => {
    setIsSubmitting(true);
    try {
      const payload: {
        paymentProcessor: string;
        paypalSubscriptionId?: string;
        stripePaymentMethodId?: string;
      } = {
        paymentProcessor: processor,
      };

      if (processor === "paypal") {
        payload.paypalSubscriptionId = paymentId;
      } else if (processor === "stripe") {
        payload.stripePaymentMethodId = paymentId;
      }

      await api.post("/auth/subscribe", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptionStatus(true);
      toast.success(
        `Subscription successful via ${
          processor === "paypal" ? "PayPal" : "Stripe"
        }!`
      );
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Subscription failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleStripeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !user || !token) {
      toast.error("Payment gateway not loaded or user not authenticated.");
      return;
    }
    setIsSubmitting(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card details are missing.");
      setIsSubmitting(false);
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    });

    if (error) {
      toast.error(error.message || "Failed to create payment method.");
      setIsSubmitting(false);
      return;
    }

    await handleSubscriptionSuccess(paymentMethod.id, "stripe");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <FaHeart className="h-8 w-8 text-rose-600" />
            <span className="text-2xl font-bold text-gray-900">
              Unistudents Match
            </span>
          </Link>
        </div>

        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Subscribe</h2>
          <p className="text-rose-600 mb-6">
            Unlock premium features with your subscription (£14.99/month after
            30-day trial)
          </p>

          <div className="mb-4 flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedPaymentMethod === "paypal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedPaymentMethod("paypal")}
              disabled={isSubmitting || isLoading}
            >
              Pay with PayPal
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedPaymentMethod === "stripe"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedPaymentMethod("stripe")}
              disabled={isSubmitting || isLoading}
            >
              Pay with Card (Stripe)
            </button>
          </div>

          {selectedPaymentMethod === "paypal" && (
            <div className="space-y-4">
              <PayPalButtons
                style={{ layout: "vertical" }}
                disabled={isSubmitting || isLoading}
                createSubscription={async (_data, _actions) => {
                  try {
                    const response = await api.post(
                      "/api/auth/subscribe", // This hits your backend to create PayPal subscription
                      { paymentProcessor: "paypal" },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (!response.data || !response.data.subscriptionId) {
                      toast.error(
                        "Failed to get PayPal subscription ID from server."
                      );
                      throw new Error("No PayPal subscription ID returned");
                    }

                    return response.data.subscriptionId; // 👈 Pass this to PayPal SDK
                  } catch (error: any) {
                    console.error("PayPal createSubscription error:", error);
                    toast.error("Failed to initiate PayPal subscription.");
                    throw error;
                  }
                }}
                onApprove={async (data, _actions) => {
                  if (data.subscriptionID) {
                    await handleSubscriptionSuccess(
                      data.subscriptionID,
                      "paypal"
                    );
                  } else {
                    toast.error("PayPal subscription ID not received.");
                    setIsSubmitting(false);
                  }
                }}
                onError={(err) => {
                  console.error("PayPal Error:", err);
                  toast.error("PayPal subscription failed. Please try again.");
                  setIsSubmitting(false);
                }}
              />
            </div>
          )}

          {selectedPaymentMethod === "stripe" && (
            <form onSubmit={handleStripeSubmit} className="space-y-4">
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <label
                  htmlFor="card-element"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Credit or debit card
                </label>
                <CardElement
                  id="card-element"
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                  className="p-3 border rounded-md bg-white focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all shadow-md"
                disabled={!stripe || isSubmitting || isLoading}
              >
                {isSubmitting ? "Processing..." : "Subscribe with Card"}
              </Button>
            </form>
          )}

          <div className="mt-6">
            <Button
              className="flex items-center w-full justify-center"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isSubmitting || isLoading}
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
