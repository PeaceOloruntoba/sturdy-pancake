import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "../../components/Button";
import { logo } from "../../assets";

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, user, token } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    agreeTerms: false,
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      setIsSubmitting(false);
    }
  }, [error]);

  useEffect(() => {
    if (user && token) {
      navigate("/subscribe");
      toast.info("Please complete your subscription to continue.");
    }
  }, [user, token, navigate]);

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

    setIsSubmitting(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        gender: formData.gender,
        university: formData.university,
        status: formData.status,
        description: formData.description,
        lookingFor: formData.lookingFor,
        guardianEmail:
          formData.gender === "female" ? formData.guardianEmail : undefined,
        guardianPhone:
          formData.gender === "female" ? formData.guardianPhone : undefined,
        agreeTerms: formData.agreeTerms,
      });
      toast.success("Registration successful! Please subscribe to continue.");
      navigate("/subscribe");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex flex-col items-center w-full">
      <div className="flex items-center justify-between p-4 md:px-8 border-b bg-black/80 backdrop-blur-sm w-full h-fit mb-12 md:mb-24">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="" className="w-12 h-12" />
          <span className="text-2xl font-bold text-gray-100">
            Unistudents Match
          </span>
        </Link>
        <div className="text-sm text-gray-300">Step {step} of 3</div>
      </div>

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
            <p className="text-rose-600 mb-6">Start your journey today</p>
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
                    disabled={isLoading}
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
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your last name"
                    disabled={isLoading}
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
                  disabled={isLoading}
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
                  placeholder="Create a password"
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleNext}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Continue"}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
            <p className="text-rose-600 mb-6">Tell us about yourself</p>
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
                    disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                  onChange={(e) => updateFormData("university", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Your university"
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  onChange={(e) => updateFormData("lookingFor", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Describe what you're looking for in a partner..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              {formData.gender === "female" && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Guardian Information
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    For your safety, we'll notify your guardian when you receive
                    messages.
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex items-center"
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
                  {isLoading ? "Processing..." : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Terms & Conditions</h2>
            <p className="text-rose-600 mb-6">
              Please review and accept our terms
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto text-sm">
                <h4 className="font-semibold mb-2">Terms of Service</h4>
                <p className="mb-2">
                  By using Unistudents Match, you agree to our community
                  guidelines and terms of service. This includes maintaining
                  respectful communication, providing accurate information, and
                  following Islamic principles in all interactions.
                </p>
                <p className="mb-2">
                  We reserve the right to moderate content and remove
                  inappropriate material. Your privacy and safety are our top
                  priorities.
                </p>
                <p>
                  Subscription is required to access premium features
                  (£14.99/month after a 30-day free trial).
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
                  disabled={isSubmitting || isLoading}
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={handleBack}
                  disabled={isSubmitting || isLoading}
                >
                  <FaArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={!formData.agreeTerms || isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? "Registering..." : "Register"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
