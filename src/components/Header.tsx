import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "./Button";
import { logo } from "../assets/index.ts";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="" className="w-18 h-14" />
          <span className="text-2xl font-bold text-gray-100">
            Unistudents Match
          </span>
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <button className="text-white font-semibold cursor-pointer px-6 text-lg">Dashboard</button>
              </Link>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="text-white font-semibold cursor-pointer px-6 text-lg">Login</button>
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
