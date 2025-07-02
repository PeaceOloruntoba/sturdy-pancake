import { Link, useNavigate } from "react-router";
import { FaHome, FaComments, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-6 text-white w-full">
      <div className="flex flex-col gap-4 animate-slideIn">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-rose-600 hover:scale-105 transition-all duration-300"
        >
          <FaHome className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/chats"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-rose-600 hover:scale-105 transition-all duration-300"
        >
          <FaComments className="h-5 w-5" />
          <span>Chats</span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-rose-600 hover:scale-105 transition-all duration-300"
        >
          <FaUser className="h-5 w-5" />
          <span>Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg bg-rose-700 hover:bg-rose-800 hover:scale-105 transition-all duration-300 text-left"
        >
          <FaSignOutAlt className="h-5 w-5" />
          <span>Logout</span>
        </button>
        <button className="flex items-center gap-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all duration-300 text-left">
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
