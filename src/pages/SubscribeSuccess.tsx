import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import api from "../utils/api";
import { useAuthStore } from "../store/useAuthStore";
import { FaCheckCircle } from "react-icons/fa";

export default function SubscribeSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, setSubscriptionStatus } = useAuthStore();

  useEffect(() => {
    const verifySubscription = async () => {
      const subscriptionId = searchParams.get("subscription_id");
      const baToken = searchParams.get("ba_token");
      const tokenParam = searchParams.get("token");

      if (!subscriptionId || !baToken || !tokenParam) {
        toast.error("Missing PayPal approval details.");
        navigate("/subscribe");
        return;
      }

      try {
        const response = await api.post(
          "/api/auth/confirm-paypal-subscription",
          {
            subscriptionId,
            baToken,
            token: tokenParam,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setSubscriptionStatus(true);
          toast.success("Subscription activated successfully!");
          navigate("/dashboard");
        } else {
          toast.error("Subscription verification failed.");
          navigate("/subscribe");
        }
      } catch (error: any) {
        console.error("Error verifying subscription:", error);
        toast.error(
          error.response?.data?.message || "Failed to verify subscription."
        );
        navigate("/subscribe");
      }
    };

    verifySubscription();
  }, [searchParams, token, navigate, setSubscriptionStatus]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-green-50">
      <FaCheckCircle className="text-green-500 text-6xl mb-4" />
      <h1 className="text-2xl font-bold text-green-700">
        Verifying your subscription...
      </h1>
      <p className="mt-2 text-gray-600">
        Please wait while we confirm your subscription with PayPal.
      </p>
    </div>
  );
}
