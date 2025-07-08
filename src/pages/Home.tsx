import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  FaShieldAlt,
  FaUsers,
  FaHeart,
  FaBolt,
  FaHandshake,
  FaUserPlus,
  FaEdit,
  FaComments,
  FaRing,
} from "react-icons/fa";
import { Button } from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Online image URLs for the carousel and sections
const heroImageCarouselUrls = [
  "https://placehold.co/1920x1080/e0f2f7/4a90e2?text=Muslim+Couple+1", // Placeholder for first hero image (larger for background)
  "https://placehold.co/1920x1080/d0e9f0/367c9c?text=Muslim+Couple+2", // Placeholder for second hero image
  "https://placehold.co/1920x1080/c0e0e7/2a6a8a?text=Muslim+Couple+3", // Added a third image for more variety
];

const helpSectionImageUrl =
  "https://placehold.co/800x600/f8f9fa/6c757d?text=Muslim+Woman+Smiling"; // Placeholder for help section image

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % heroImageCarouselUrls.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 font-inter">
      <Header />

      {/* Hero Section: Animated Background Image Carousel */}
      <section
        className="relative py-20 px-4 overflow-hidden md:py-32 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${heroImageCarouselUrls[currentImageIndex]})`,
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          {/* Text Content */}
          <div className="text-center md:text-left md:w-full z-10 animate-fade-in-up text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Believe In Your Happy Ever After...
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto md:mx-0">
              The premier platform for Muslim university students and graduates
              seeking their righteous spouse for a blessed marriage. Connect
              with like-minded individuals who share their faith, values, and
              academic journey.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto"
                >
                  Start Your Journey
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-rose-600"
              >
                How It Works
              </Button>
            </div>
            <p className="text-sm mt-4">
              30-day free trial • No commitment • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* We're here to help you section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Image for help section */}
          <div className="md:w-1/2 flex justify-center animate-fade-in-left">
            <img
              src={helpSectionImageUrl}
              alt="A Muslim woman smiling, representing support"
              className="rounded-3xl shadow-lg w-full max-w-sm md:max-w-md h-auto object-cover"
            />
          </div>
          {/* Text content for help section */}
          <div className="text-center md:text-left md:w-1/2 animate-fade-in-right">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              We're here to help you
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              We know how difficult it is meeting someone special to share
              life's journey with... you want to find someone deeply compatible,
              but in a way that doesn't compromise your values as a practising
              Muslim.
            </p>
            <p className="text-lg md:text-xl text-gray-700">
              That's why we created Unistudents Match which is designed to help
              you connect with the right person in a halal way.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section (Vertical Timeline Layout) */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            How Unistudents Match Works
          </h2>
          <div className="relative wrap overflow-hidden p-10 h-full">
            {/* Vertical line */}
            <div
              className="border-2-2 absolute border-opacity-20 border-rose-600 h-full border"
              style={{ left: "50%" }}
            ></div>

            {/* Timeline Item 1 (Left) */}
            <div className="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
              <div className="order-1 w-5/12 md:w-5/12"></div>{" "}
              {/* Empty div for spacing on the right on desktop */}
              <div className="z-20 flex items-center order-1 bg-rose-600 shadow-xl w-8 h-8 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-white">1</h1>
              </div>
              <div className="order-1 bg-white rounded-xl shadow-xl w-full md:w-5/12 px-6 py-4 text-left animate-fade-in-left">
                <FaUserPlus className="h-10 w-10 text-rose-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  1. Register & Verify
                </h3>
                <p className="text-gray-600">
                  Create your account and complete our secure verification
                  process to join the community.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 (Right) */}
            <div className="mb-8 flex justify-between items-center w-full right-timeline">
              <div className="order-1 w-5/12 md:w-5/12"></div>{" "}
              {/* Empty div for spacing on the left on desktop */}
              <div className="z-20 flex items-center order-1 bg-rose-600 shadow-xl w-8 h-8 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-white">2</h1>
              </div>
              <div className="order-1 bg-white rounded-xl shadow-xl w-full md:w-5/12 px-6 py-4 text-left animate-fade-in-right">
                <FaEdit className="h-10 w-10 text-rose-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  2. Build Your Profile
                </h3>
                <p className="text-gray-600">
                  Share your background, values, and what you're seeking in a
                  spouse in a detailed profile.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 (Left) */}
            <div className="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
              <div className="order-1 w-5/12 md:w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-rose-600 shadow-xl w-8 h-8 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-white">3</h1>
              </div>
              <div className="order-1 bg-white rounded-xl shadow-xl w-full md:w-5/12 px-6 py-4 text-left animate-fade-in-left">
                <FaComments className="h-10 w-10 text-rose-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  3. Connect & Communicate
                </h3>
                <p className="text-gray-600">
                  Browse compatible profiles and initiate conversations in a
                  safe, moderated chat environment.
                </p>
              </div>
            </div>

            {/* Timeline Item 4 (Right) */}
            <div className="mb-8 flex justify-between items-center w-full right-timeline">
              <div className="order-1 w-5/12 md:w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-rose-600 shadow-xl w-8 h-8 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-white">4</h1>
              </div>
              <div className="order-1 bg-white rounded-xl shadow-xl w-full md:w-5/12 px-6 py-4 text-left animate-fade-in-right">
                <FaRing className="h-10 w-10 text-rose-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  4. Towards Nikah
                </h3>
                <p className="text-gray-600">
                  Take the next steps towards meeting your potential spouse and
                  building a blessed marriage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Unistudents Match Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Unistudents Match for Your Nikah?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white shadow-lg rounded-xl p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <FaShieldAlt className="h-12 w-12 text-rose-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Halal & Secure Environment
              </h3>
              <p className="text-gray-600">
                Advanced content moderation and optional guardian notifications
                for female users ensure a safe, Islamic-compliant space.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <FaUsers className="h-12 w-12 text-rose-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Educated Muslim Community
              </h3>
              <p className="text-gray-600">
                Connect with fellow Muslim students and graduates who share your
                educational aspirations and deen-centric values.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <FaHandshake className="h-12 w-12 text-rose-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Respectful & Modest Matching
              </h3>
              <p className="text-gray-600">
                Photo sharing requires mutual consent, ensuring privacy and
                respectful interactions in line with Islamic etiquette.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <FaBolt className="h-12 w-12 text-rose-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Unlimited Potential
              </h3>
              <p className="text-gray-600">
                Send unlimited messages and requests to find your perfect match
                without restrictions, guiding you towards Nikah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              Premium Membership
            </h3>
            <p className="text-gray-600 mb-4">
              Everything you need to find your spouse
            </p>
            <div className="text-5xl font-extrabold mb-2 text-rose-700">
              £14.99<span className="text-xl text-gray-500">/month</span>
            </div>
            <div className="text-green-600 font-semibold mb-4">
              30-day free trial
            </div>
            <ul className="text-left space-y-2 mb-6 text-gray-700">
              <li className="flex items-center">
                <FaHeart className="text-rose-500 mr-2" /> Unlimited messaging
              </li>
              <li className="flex items-center">
                <FaHeart className="text-rose-500 mr-2" /> Send unlimited
                requests
              </li>
              <li className="flex items-center">
                <FaHeart className="text-rose-500 mr-2" /> Photo sharing with
                consent
              </li>
              <li className="flex items-center">
                <FaHeart className="text-rose-500 mr-2" /> Advanced profile
                matching
              </li>
              <li className="flex items-center">
                <FaHeart className="text-rose-500 mr-2" /> Safe & moderated
                environment
              </li>
            </ul>
            <Link to="/signup">
              <Button className="w-full bg-rose-600 hover:bg-rose-700 py-3 text-lg">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
