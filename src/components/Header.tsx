import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "./Button";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "./Logo.tsx";

export default function Header() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="border-b bg-black/80 backdrop-blur-sm fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Logo />
          <span className="text-xl sm:text-2xl font-bold text-gray-100">
            Unistudents Match
          </span>
        </Link>
        <button className="sm:hidden text-white text-2xl" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row sm:items-center sm:space-x-4 absolute sm:static top-16 left-0 w-full sm:w-auto bg-black/80 sm:bg-transparent p-4 sm:p-0 gap-y-4`}
        >
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <button className="text-white font-semibold cursor-pointer px-4 py-2 text-base sm:text-lg hover:bg-gray-800 rounded-md w-full sm:w-auto text-left">
                  Dashboard
                </button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="text-white px-4 py-2 text-base sm:text-lg w-full sm:w-auto text-left"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="text-white font-semibold cursor-pointer px-4 py-2 text-base sm:text-lg hover:bg-gray-800 rounded-md w-full sm:w-auto text-left">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-rose-600 hover:bg-rose-700 px-4 py-2 text-base sm:text-lg w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
