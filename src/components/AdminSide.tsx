import { Link, useNavigate } from "react-router";
import { FaHome, FaComments, FaSignOutAlt } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

export default function AdminSide() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-6 text-white w-full">
      <div className="flex flex-col gap-8 animate-slideIn h-full">
        <div>
          <Link
            to="/admin"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-rose-600 hover:scale-105 transition-all duration-300"
          >
            <FaHome className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        <Link
          to="/admin/chats"
          className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-rose-600 transition-all duration-300"
        >
          <FaComments className="h-4 sm:h-5 w-4 sm:w-5" />
          <span>Chats</span>
        </Link>
        </div>
        <div className="flex flex-col gap-4">
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
    </div>
  );
}
