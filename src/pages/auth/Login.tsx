import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { FaHeart } from "react-icons/fa";
import { Button } from "../../components/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, user } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setIsSubmitting(false);
    }
    if (user) {
      navigate(user.hasActiveSubscription ? "/dashboard" : "/subscribe");
      toast.info(
        user.hasActiveSubscription
          ? "Welcome back!"
          : "Please complete your subscription to continue."
      );
    }
  }, [error, user, navigate]);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <p className="text-gray-600 mb-6">Sign in to your account</p>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter your email"
                disabled={isSubmitting || isLoading}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter your password"
                disabled={isSubmitting || isLoading}
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-rose-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
