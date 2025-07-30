import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FaHome,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaShareAlt,
} from "react-icons/fa";
import { TbPhoto } from "react-icons/tb";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import ShareModal from "./ShareModal";

export default function Sidebar({ onToggle }: { onToggle: () => void }) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
    onToggle();
  };

  const toggleShareModal = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-4 sm:p-6 text-white w-full">
      <div className="flex flex-col gap-3 sm:gap-4 animate-slideIn">
        <Link
          to="/dashboard"
          onClick={onToggle}
          className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-rose-600 transition-all duration-300 text-sm sm:text-base"
        >
          <FaHome className="h-4 sm:h-5 w-4 sm:w-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/chats"
          onClick={onToggle}
          className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-rose-600 transition-all duration-300 text-sm sm:text-base"
        >
          <FaComments className="h-4 sm:h-5 w-4 sm:w-5" />
          <span>Chats</span>
        </Link>
        <Link
          to="/profile"
          onClick={onToggle}
          className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-rose-600 transition-all duration-300 text-sm sm:text-base"
        >
          <FaUser className="h-4 sm:h-5 w-4 sm:w-5" />
          <span>Profile</span>
        </Link>
        <Link
          to="/photos"
          onClick={onToggle}
          className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-rose-600 transition-all duration-300 text-sm sm:text-base"
        >
          <TbPhoto className="h-4 sm:h-5 w-4 sm:w-5" />
          <span>Photos</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-rose-700 hover:bg-rose-800 transition-all duration-300 text-sm sm:text-base text-left"
        >
          <FaSignOutAlt className="h-4 sm:h-5 w-4 sm:w-5" />
          <span>Logout</span>
        </button>
        <button
          onClick={toggleShareModal}
          className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300 text-sm sm:text-base text-left"
        >
          <FaShareAlt className="h-4 sm:h-5 w-4 sm:w-5" />
          <span>Share</span>
        </button>
      </div>
      <ShareModal isOpen={isShareModalOpen} onClose={toggleShareModal} />
    </div>
  );
}
