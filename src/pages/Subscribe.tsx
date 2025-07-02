import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { Button } from "../components/Button";
import { PayPalButtons } from "@paypal/react-paypal-js";
import api from "../utils/api";

export default function SubscribePage() {
  const navigate = useNavigate();
  const { user, token, isLoading, setSubscriptionStatus } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      toast.error("Please log in to subscribe.");
    }
  }, [user, token, navigate]);

  const handlePaymentSuccess = async (orderId: string) => {
    setIsSubmitting(true);
    try {
      const response = await api.post(
        "/auth/subscribe",
        { paypalOrderId: orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubscriptionStatus(true);
      console.log(response)
      toast.success("Subscription successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Subscription failed. Please try again.");
      setIsSubmitting(false);
    }
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
          <p className="text-rose-600 mb-6">Unlock premium features with your subscription (£14.99/month after 30-day trial)</p>
          <div className="space-y-4">
            <PayPalButtons
              style={{ layout: "vertical" }}
              disabled={isSubmitting || isLoading}
              createOrder={async () => {
                try {
                  const response = await api.post(
                    "/auth/subscribe",
                    { initialize: true },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  return response.data.paypalOrderId;
                } catch (error) {
                  toast.error("Failed to initialize payment. Please try again.");
                  throw error;
                }
              }}
              onApprove={async (data, actions: any) => {
                await actions.order.capture();
                await handlePaymentSuccess(data.orderID);
              }}
              onError={(err) => {
                console.log(err)
                toast.error("Payment failed. Please try again.");
                setIsSubmitting(false);
              }}
            />
            <Button
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