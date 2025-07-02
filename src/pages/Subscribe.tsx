import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { FaHeart } from "react-icons/fa";
import { Button } from "../components/Button";

// declare global {
//   interface Window {
//     paypal: any;
//   }
// }

export default function SubscribePage() {
  const navigate = useNavigate();
  const { user, token, isLoading, subscribe, error } = useAuthStore();
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (!user || !token) {
      toast.info("Please log in to subscribe.");
      navigate("/login");
    } else if (user.hasActiveSubscription) {
      toast.info("You are already subscribed!");
      navigate("/dashboard");
    }
  }, [user, token, navigate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${
      import.meta.env.VITE_PAYPAL_CLIENT_ID
    }&components=card-fields`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async () => {
    if (
      !paymentDetails.cardNumber ||
      !paymentDetails.expiryDate ||
      !paymentDetails.cvv
    ) {
      toast.error("Please fill in all payment details.");
      return;
    }

    setIsProcessing(true);
    try {
      await subscribe(paymentDetails);
      toast.success("Subscription activated successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Subscription failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const updatePaymentDetails = (field: string, value: string) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading || !user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <p className="text-gray-700">Loading user data...</p>
      </div>
    );
  }

  if (user.hasActiveSubscription) {
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
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <FaHeart className="h-8 w-8 text-rose-600" />
            <span className="text-2xl font-bold text-gray-900">
              Unistudents Match
            </span>
          </Link>
        </div>
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
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                value={paymentDetails.cardNumber}
                onChange={(e) =>
                  updatePaymentDetails("cardNumber", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  value={paymentDetails.expiryDate}
                  onChange={(e) =>
                    updatePaymentDetails("expiryDate", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium text-gray-700"
                >
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  value={paymentDetails.cvv}
                  onChange={(e) => updatePaymentDetails("cvv", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="123"
                />
              </div>
            </div>
            {!paypalLoaded && (
              <p className="text-center text-gray-500">
                Loading payment options...
              </p>
            )}
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isProcessing || !paypalLoaded || !user || !token}
            >
              {isProcessing
                ? "Processing Payment..."
                : "Start 30-Day Free Trial"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
