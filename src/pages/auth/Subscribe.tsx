// pages/SubscribePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../../components/Button";
import api from "../../utils/api";

// Define the interface for the PayPal Card Fields component
interface PayPalCardFieldsComponent {
  render: (selectors: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
  }) => void;
  submit: () => Promise<void>;
  close: () => void;
}

export default function SubscribePage() {
  const navigate = useNavigate();
  const { user, token, isLoading, updateUser } = useAuthStore();
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [cardFields, setCardFields] =
    useState<PayPalCardFieldsComponent | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [cardLast4, setCardLast4] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Redirect if user is not logged in or already subscribed
  useEffect(() => {
    if (!user || !token) {
      toast.info("Please log in to access this page.");
      navigate("/login");
    } else if (user.subscription?.status === "active") {
      toast.info("You are already subscribed!");
      navigate("/dashboard"); // Or wherever active subscribers go
    }
  }, [user, token, navigate]);

  // Effect to check if PayPal SDK is loaded
  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
    } else {
      const checkPaypal = setInterval(() => {
        if (window.paypal) {
          setPaypalLoaded(true);
          clearInterval(checkPaypal);
        }
      }, 100);
      return () => clearInterval(checkPaypal);
    }
  }, []);

  // Initialize PayPal Card Fields when PayPal SDK is loaded and on this page
  useEffect(() => {
    if (
      paypalLoaded &&
      window.paypal &&
      window.paypal.CardFields &&
      !cardFields
    ) {
      try {
        const fields = window.paypal.CardFields({
          createOrder: async () => {
            try {
              // Call backend to create an AUTHORIZE order
              const response = await api.post(
                "/auth/paypal/create-order",
                {},
                {
                  headers: { Authorization: `Bearer ${token}` }, // Pass token for authorized request
                }
              );
              const { orderId } = response.data;
              return orderId;
            } catch (err: any) {
              toast.error(`Failed to initiate PayPal order: ${err.message}`);
              console.error("PayPal createOrder error:", err);
              throw err;
            }
          },
          onApprove: async (data: any) => {
            console.log("PayPal authorization approved:", data.orderID);
            setPaypalOrderId(data.orderID);
            setCardLast4(data.paymentSource?.card?.last_digits || "XXXX");
            toast.success(
              "Payment details validated. Proceeding to subscribe."
            );

            // Now capture the payment on the backend
            setIsProcessingPayment(true);
            try {
              const captureResponse = await api.post(
                `/payments/capture-payment`,
                {
                  userId: user?.id, // Assuming user.id is available
                  paypalOrderId: data.orderID,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (captureResponse.status === 200) {
                toast.success("Subscription activated successfully!");
                // Update user status in Zustand store
                updateUser({ subscription: {
                  status: "active",
                  startDate: new Date(),
                  trialEndsAt: new Date()
                } });
                navigate("/dashboard"); // Redirect to dashboard
              } else {
                toast.error(
                  "Failed to activate subscription after payment validation."
                );
              }
            } catch (captureErr: any) {
              toast.error(
                `Subscription activation failed: ${
                  captureErr.message || "An unknown error occurred."
                }`
              );
              console.error("PayPal capture error:", captureErr);
            } finally {
              setIsProcessingPayment(false);
            }
          },
          onError: (err: any) => {
            toast.error(
              `PayPal error: ${err.message || "An unknown error occurred."}`
            );
            console.error("PayPal Card Fields Error:", err);
            setIsProcessingPayment(false);
          },
        });

        fields.render({
          cardNumber: "#card-number-field",
          expirationDate: "#expiration-date-field",
          cvv: "#cvv-field",
        });
        setCardFields(fields);
      } catch (err: any) {
        toast.error(`Error setting up PayPal card fields: ${err.message}`);
      }
    }

    return () => {
      if (cardFields) {
        cardFields.close();
        setCardFields(null);
      }
    };
  }, [paypalLoaded, cardFields, user, token, navigate, updateUser]);

  const handleSubscribeClick = async () => {
    if (!paypalLoaded || !cardFields || isProcessingPayment) {
      toast.error(
        "Payment system not ready or already processing. Please wait."
      );
      return;
    }
    setIsProcessingPayment(true);
    try {
      // This will trigger createOrder and onApprove callbacks
      await cardFields.submit();
    } catch (err: any) {
      console.error(
        "Error submitting PayPal Card Fields for authorization:",
        err
      );
      setIsProcessingPayment(false);
    }
  };

  if (isLoading || !user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <p className="text-gray-700">Loading user data...</p>
      </div>
    );
  }

  if (user.subscription?.status === "active") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <p className="text-green-700 text-xl font-semibold">
          You are already subscribed! Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">
            Activate Your Subscription
          </h2>
          <p className="text-gray-600 mb-6">
            Enjoy full access to Unistudents Match with a 30-day free trial,
            then £14.99/month.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Free Trial & Subscription Details
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 30 days completely free</li>
                <li>• Cancel anytime during trial</li>
                <li>• No charges if cancelled before trial ends</li>
                <li>• £14.99/month after trial period</li>
              </ul>
            </div>

            <div
              id="card-fields-container"
              className="border border-gray-300 rounded-md p-2"
            >
              <div id="card-number-field"></div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div id="expiration-date-field"></div>
                <div id="cvv-field"></div>
              </div>
            </div>

            {!paypalLoaded && (
              <p className="text-center text-gray-500">
                Loading payment options...
              </p>
            )}

            <Button
              onClick={handleSubscribeClick}
              className="w-full"
              disabled={isProcessingPayment || !paypalLoaded || !user || !token}
            >
              {isProcessingPayment
                ? "Processing Payment..."
                : "Start 30-Day Free Trial"}
            </Button>

            {paypalOrderId && (
              <p className="text-sm text-gray-600 text-center mt-4">
                Payment method authorized. Last 4 digits: {cardLast4}. You will
                be charged after your trial ends.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
