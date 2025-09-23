import { Link, useNavigate } from "react-router";
import { FaHome, FaComments, FaSignOutAlt } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

export default function AdminSide({
  onToggle,
}: {
  onToggle?: () => void;
}) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
    onToggle?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-4 sm:p-6 text-white w-full">
      <div className="flex flex-col gap-6 sm:gap-8 animate-slideIn h-full">
        <div>
          <Link
            to="/admin"
            onClick={onToggle}
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-rose-600 transition-all duration-300 text-sm sm:text-base"
          >
            <FaHome className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/chats"
            onClick={onToggle}
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-rose-600 transition-all duration-300 text-sm sm:text-base"
          >
            <FaComments className="h-5 w-5" />
            <span>Chats</span>
          </Link>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-rose-700 hover:bg-rose-800 transition-all duration-300 text-sm sm:text-base text-left"
          >
            <FaSignOutAlt className="h-5 w-5" />
            <span>Logout</span>
          </button>
          <button
            onClick={onToggle}
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300 text-sm sm:text-base text-left"
          >
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
