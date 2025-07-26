import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  FaShieldAlt,
  FaUsers,
  FaHeart,
  FaBolt,
  FaHandshake,
  // FaUserPlus,
  // FaEdit,
  // FaComments,
  // FaRing,
} from "react-icons/fa";
import { Button } from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { home } from "../assets";

const heroImageCarouselUrls = [
  "https://tse2.mm.bing.net/th/id/OIP.KSMEguBxtFIZ0V8Chk8qOAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", // Muslim couple praying
  "https://img.freepik.com/premium-photo/spirit-collaborative-learning-muslim-students-engage-vibrant-study-sessions-terengganu_983420-279212.jpg", // Muslim students studying
  "https://img.freepik.com/premium-photo/happy-muslim-family-enjoying-holy-month-ramadan-while-praying-reading-quran-together-modern-home_530697-71040.jpg", // Muslim family joy (using a similar image for variety)
  "https://askislam.ir/en/wp-content/uploads/2017/06/515.jpg", // Quran and ring (symbolic)
  "https://tse4.mm.bing.net/th/id/OIP.gsObhuNBh9NakMGdBfuxgQHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", // Another student-focused image
];


const pricingSectionBgImageUrl =
  "https://tse1.mm.bing.net/th/id/OIP.gF_bHO0WkT8obtnQZw9YFgHaEw?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"; // Islamic geometric pattern (abstract)

const useScrollAnimation = (): [React.RefObject<HTMLDivElement | null>, boolean] => {
  // Changed HTMLElement to HTMLDivElement for specificity
  const ref = useRef<HTMLDivElement>(null); // Changed HTMLElement to HTMLDivElement
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.2,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
};

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [helpRef, helpVisible] = useScrollAnimation();
  // const [howItWorksRef, howItWorksVisible] = useScrollAnimation();
  const [whyChooseUsRef, whyChooseUsVisible] = useScrollAnimation();
  const [pricingRef, pricingVisible] = useScrollAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % heroImageCarouselUrls.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 font-inter">
      <Header />

      <section
        className="relative py-20 px-4 overflow-hidden md:py-32 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${heroImageCarouselUrls[currentImageIndex]})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70 bg-opacity-50"></div>

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
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

      <section
        ref={helpRef}
        className={`py-16 px-4 bg-white transition-opacity duration-1000 ease-out transform ${
          helpVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 flex justify-center">
            <img
              src={home}
              alt="A Muslim woman smiling, representing support"
              className="rounded-3xl shadow-lg w-full max-w-sm md:max-w-md h-96 object-cover"
            />
          </div>
          <div className="text-center md:text-left md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 w-fit p-2 px-6 rounded-lg shadow-lg">
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

      {/* <section
        ref={howItWorksRef}
        className={`py-16 px-4 bg-gray-100 transition-opacity duration-1000 ease-out transform ${
          howItWorksVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            How Unistudents Match Works
          </h2>
          <div className="relative wrap overflow-hidden p-10 h-full">
            <div className="absolute border-opacity-20 border-rose-600 h-full border-l-2 left-5 md:left-1/2 md:transform md:-translate-x-1/2"></div>

            <div className="mb-8 flex items-center w-full relative md:justify-between md:flex-row-reverse">
              <div className="z-20 flex items-center bg-rose-600 shadow-xl w-8 h-8 rounded-full absolute left-5 transform -translate-x-1/2 md:relative md:left-auto md:transform-none">
                <h1 className="mx-auto font-semibold text-lg text-white">1</h1>
              </div>
              <div className="bg-white rounded-xl shadow-xl w-full md:w-5/12 px-6 py-4 text-left ml-14 md:ml-0 md:mr-auto">
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

            <div className="mb-8 flex items-center w-full relative md:justify-between md:flex-row">
              <div className="z-20 flex items-center bg-rose-600 shadow-xl w-8 h-8 rounded-full absolute left-5 transform -translate-x-1/2 md:relative md:left-auto md:transform-none">
                <h1 className="mx-auto font-semibold text-lg text-white">2</h1>
              </div>
              <div className="bg-white rounded-xl shadow-xl w-full md:w-5/12 px-6 py-4 text-left ml-14 md:ml-0 md:ml-auto">
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

            <div className="mb-8 flex items-center w-full relative md:justify-between md:flex-row-reverse">
              <div className="z-20 flex items-center bg-rose-600 shadow-xl w-8 h-8 rounded-full absolute left-5 transform -translate-x-1/2 md:relative md:left-auto md:transform-none">
                <h1 className="mx-auto font-semibold text-lg text-white">3</h1>
              </div>
              <div className="bg-white rounded-xl shadow-xl w-full md:w-5/12 px-6 py-4 text-left ml-14 md:ml-0 md:mr-auto">
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

            <div className="mb-8 flex items-center w-full relative md:justify-between md:flex-row">
              <div className="z-20 flex items-center bg-rose-600 shadow-xl w-8 h-8 rounded-full absolute left-5 transform -translate-x-1/2 md:relative md:left-auto md:transform-none">
                <h1 className="mx-auto font-semibold text-lg text-white">4</h1>
              </div>
              <div className="bg-white rounded-xl shadow-xl w-full md:w-5/12 px-6 py-4 text-left ml-14 md:ml-0 md:ml-auto">
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
      </section> */}

      <section
        ref={whyChooseUsRef}
        className={`py-16 px-4 bg-gray-50 transition-opacity duration-1000 ease-out transform ${
          whyChooseUsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
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

      <section
        ref={pricingRef}
        className={`relative py-16 px-4 bg-cover bg-center transition-opacity duration-1000 ease-out transform ${
          pricingVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
        style={{ backgroundImage: `url(${pricingSectionBgImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/70 bg-opacity-60"></div>
        <div className="container mx-auto text-center relative z-10 text-white">
          {/* <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Simple, Transparent Pricing
          </h2> */}
          <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl text-gray-900">
            <h3 className="text-2xl font-bold mb-2">Premium Membership</h3>
            <p className="text-gray-700 mb-4">
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
