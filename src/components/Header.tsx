import { Link } from "react-router";
import { FaHeart } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "./Button";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <FaHeart className="h-8 w-8 text-rose-600" />
          <span className="text-2xl font-bold text-gray-900">
            Unistudents Match
          </span>
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-rose-600 hover:bg-rose-700">
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
