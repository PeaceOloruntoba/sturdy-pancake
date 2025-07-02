// pages/auth/Signup.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { Button } from "../../components/Button";
import api from "../../utils/api";

declare global {
  interface Window {
    paypal: any;
  }
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, user, token } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    university: "",
    status: "",
    description: "",
    lookingFor: "",
    guardianEmail: "",
    guardianPhone: "",
    paypalOrderId: "",
    cardLast4: "",
    cardProcessor: "",
    agreeTerms: false,
  });
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [cardFields, setCardFields] = useState<any>(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (user && token) {
      navigate("/dashboard");
      toast.info("You are already logged in!");
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (paypalLoaded && window.paypal && step === 3 && !cardFields) {
      try {
        // PayPal Card Fields instance setup
        const fields = window.paypal.CardFields({
          createOrder: async () => {
            try {
              const response = await api.post("/auth/paypal/create-order"); // Call your new backend endpoint
              const { orderId } = response.data;
              return orderId; // Return the order ID to PayPal
            } catch (err: any) {
              toast.error(`Failed to initiate PayPal order: ${err.message}`);
              console.error("PayPal createOrder error:", err);
              throw err; // Re-throw to prevent PayPal from proceeding
            }
          },
          onApprove: (data: any) => {
            console.log("PayPal authorization approved:", data.orderID);
            setFormData((prev) => ({
              ...prev,
              paypalOrderId: data.orderID,
              cardLast4: data.paymentSource?.card?.last_digits || "XXXX", // Attempt to get last4 if available
              cardProcessor: "paypal",
            }));
            toast.success("Payment details validated successfully!");
            handleNext(); // Move to T&C after successful payment validation
          },
          onError: (err: any) => {
            toast.error(
              `PayPal error: ${err.message || "An unknown error occurred."}`
            );
            console.error("PayPal Card Fields Error:", err);
          },
        });

        // Render the PayPal Card Fields into the designated divs
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

    // Cleanup PayPal Card Fields on unmount or step change
    return () => {
      if (cardFields) {
        cardFields.close();
        setCardFields(null);
      }
    };
  }, [paypalLoaded, step, cardFields]); // Removed formData from dependencies to prevent re-initialization loop

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    } else if (step === 2) {
      if (
        !formData.age ||
        !formData.gender ||
        !formData.university ||
        !formData.status ||
        !formData.description ||
        !formData.lookingFor
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (
        formData.gender === "female" &&
        (!formData.guardianEmail || !formData.guardianPhone)
      ) {
        toast.error("Guardian details are required for female users.");
        return;
      }
    }
    // No specific validation needed for step 3 here, as PayPal handles it
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.agreeTerms) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    try {
      // Pass the complete formData including paypalOrderId, cardLast4, cardProcessor
      await register(formData);
      toast.success("Registration successful! Welcome to Unistudents Match.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to trigger the PayPal card payment submission (authorization)
  const handlePayPalCardAuthorization = async () => {
    if (!cardFields || !paypalLoaded) {
      toast.error("Payment system not ready. Please try again.");
      return;
    }
    try {
      // This will trigger the createOrder and onApprove callbacks in PayPal Card Fields
      await cardFields.submit();
    } catch (err: any) {
      // Errors are already handled by onError in the CardFields configuration
      console.error(
        "Error submitting PayPal Card Fields for authorization:",
        err
      );
    }
  };

  return (
    <>
      {/* It's often better to load the PayPal SDK script once in your public/index.html
          or at the root of your application to prevent re-loading on every component render.
          However, for demonstration, it's here. */}
      <script
        src={`https://www.paypal.com/sdk/js?client-id=${
          import.meta.env.VITE_PAYPAL_CLIENT_ID
        }&components=card-fields`}
        onLoad={() => setPaypalLoaded(true)}
        onError={() =>
          toast.error(
            "Failed to load PayPal SDK. Please check your internet connection or client ID."
          )
        }
      />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <FaHeart className="h-8 w-8 text-rose-600" />
              <span className="text-2xl font-bold text-gray-900">
                Unistudents Match
              </span>
            </Link>
            <div className="text-sm text-gray-500">Step {step} of 4</div>
          </div>

          <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
                <p className="text-gray-600 mb-6">
                  Start your 30-day free trial today
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          updateFormData("firstName", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          updateFormData("lastName", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
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
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Create a password"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateFormData("confirmPassword", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Confirm your password"
                    />
                  </div>
                  <Button
                    onClick={handleNext}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Personal Information
                </h2>
                <p className="text-gray-600 mb-6">Tell us about yourself</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Age
                      </label>
                      <input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        placeholder="Your age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <div className="mt-1 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={(e) =>
                              updateFormData("gender", e.target.value)
                            }
                            className="mr-2"
                          />
                          Male
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={(e) =>
                              updateFormData("gender", e.target.value)
                            }
                            className="mr-2"
                          />
                          Female
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="university"
                      className="block text-sm font-medium text-gray-700"
                    >
                      University
                    </label>
                    <input
                      id="university"
                      type="text"
                      value={formData.university}
                      onChange={(e) =>
                        updateFormData("university", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Your university"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => updateFormData("status", e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="" disabled>
                        Select your status
                      </option>
                      <option value="student">Current Student</option>
                      <option value="graduate">Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Describe Yourself
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        updateFormData("description", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lookingFor"
                      className="block text-sm font-medium text-gray-700"
                    >
                      What are you looking for?
                    </label>
                    <textarea
                      id="lookingFor"
                      value={formData.lookingFor}
                      onChange={(e) =>
                        updateFormData("lookingFor", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Describe what you're looking for in a partner..."
                      rows={3}
                    />
                  </div>
                  {formData.gender === "female" && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Guardian Information
                      </h3>
                      <p className="text-sm text-blue-700 mb-4">
                        For your safety, we'll notify your guardian when you
                        receive messages.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="guardianEmail"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Guardian Email
                          </label>
                          <input
                            id="guardianEmail"
                            type="email"
                            value={formData.guardianEmail}
                            onChange={(e) =>
                              updateFormData("guardianEmail", e.target.value)
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder="Guardian's email"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="guardianPhone"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Guardian Phone
                          </label>
                          <input
                            id="guardianPhone"
                            type="tel"
                            value={formData.guardianPhone}
                            onChange={(e) =>
                              updateFormData("guardianPhone", e.target.value)
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder="Guardian's phone"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      <FaArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
                <p className="text-gray-600 mb-6">
                  Start your 30-day free trial. You won't be charged until the
                  trial ends.
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Free Trial Details
                    </h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• 30 days completely free</li>
                      <li>• Cancel anytime during trial</li>
                      <li>• No charges if cancelled before trial ends</li>
                      <li>• £14.99/month after trial period</li>
                    </ul>
                  </div>
                  {/* PayPal Card Fields will be rendered here */}
                  <div
                    id="card-fields-container"
                    className="border border-gray-300 rounded-md p-2"
                  >
                    {/* These divs will be populated by PayPal Card Fields SDK */}
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
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      <FaArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handlePayPalCardAuthorization}
                      className="flex-1"
                      disabled={isLoading || !paypalLoaded}
                    >
                      Validate Payment Details
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Terms & Conditions</h2>
                <p className="text-gray-600 mb-6">
                  Please review and accept our terms
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto text-sm">
                    <h4 className="font-semibold mb-2">Terms of Service</h4>
                    <p className="mb-2">
                      By using Unistudents Match, you agree to our community
                      guidelines and terms of service. This includes maintaining
                      respectful communication, providing accurate information,
                      and following Islamic principles in all interactions.
                    </p>
                    <p className="mb-2">
                      We reserve the right to moderate content and remove
                      inappropriate material. Your privacy and safety are our
                      top priorities.
                    </p>
                    <p>
                      Subscription will automatically renew at £14.99/month
                      after your free trial unless cancelled.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={(e) =>
                        updateFormData("agreeTerms", e.target.checked)
                      }
                      className="h-4 w-4 text-rose-600"
                    />
                    <label
                      htmlFor="agreeTerms"
                      className="text-sm text-gray-700"
                    >
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      <FaArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1"
                      disabled={
                        !formData.agreeTerms ||
                        isLoading ||
                        !formData.paypalOrderId
                      } // Ensure PayPal order is authorized
                    >
                      Start Free Trial
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
