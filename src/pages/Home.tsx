import { Link } from "react-router";
import { FaShieldAlt, FaUsers, FaHeart, FaBolt } from "react-icons/fa";
import { Button } from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <Header />
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect Match
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The first ever matchmaking service designed specifically for Muslim
            university students and graduates. Connect with like-minded
            individuals in a safe, respectful environment.
          </p>
          <div className="space-x-4">
            <Link to="/signup">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            30-day free trial • No commitment • Cancel anytime
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Unistudents Match?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <FaShieldAlt className="h-12 w-12 text-rose-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Advanced content moderation and guardian notifications for
                female users ensure a safe environment.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <FaUsers className="h-12 w-12 text-rose-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">University Focused</h3>
              <p className="text-gray-600">
                Connect with fellow students and graduates who share your
                educational background and values.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <FaHeart className="h-12 w-12 text-rose-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                Respectful Matching
              </h3>
              <p className="text-gray-600">
                Photo sharing requires mutual consent, ensuring privacy and
                respect in all interactions.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <FaBolt className="h-12 w-12 text-rose-600 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Unlimited Access</h3>
              <p className="text-gray-600">
                Send unlimited messages and requests to find your perfect match
                without restrictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Simple, Transparent Pricing
          </h2>
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-2">Premium Membership</h3>
            <p className="text-gray-600 mb-4">
              Everything you need to find your match
            </p>
            <div className="text-4xl font-bold mb-2">
              £14.99<span className="text-lg text-gray-500">/month</span>
            </div>
            <div className="text-green-600 font-semibold mb-4">
              30-day free trial
            </div>
            <ul className="text-left space-y-2 mb-6">
              <li>✓ Unlimited messaging</li>
              <li>✓ Send unlimited requests</li>
              <li>✓ Photo sharing with consent</li>
              <li>✓ Advanced profile matching</li>
              <li>✓ Safe & moderated environment</li>
            </ul>
            <Link to="/signup">
              <Button className="w-full bg-rose-600 hover:bg-rose-700">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
