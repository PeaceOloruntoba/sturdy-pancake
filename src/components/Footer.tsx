import { logo } from "../assets";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <img
            src={logo}
            alt="Unistudents Match Logo"
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
          <span className="text-lg sm:text-xl font-bold">
            Unistudents Match
          </span>
        </div>
        <p className="text-sm sm:text-base text-gray-400">
          Connecting Muslim university students and graduates worldwide
        </p>
      </div>
    </footer>
  );
}
