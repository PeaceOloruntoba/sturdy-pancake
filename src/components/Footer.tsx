import logo from "./Logo.tsx";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Logo />
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
