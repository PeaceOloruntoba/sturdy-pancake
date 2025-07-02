import { FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <FaHeart className="h-6 w-6 text-rose-400" />
          <span className="text-xl font-bold">Unistudents Match</span>
        </div>
        <p className="text-gray-400">
          Connecting Muslim university students and graduates worldwide
        </p>
      </div>
    </footer>
  );
}
