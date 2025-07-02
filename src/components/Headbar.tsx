import { useLocation } from "react-router";
import { FaHeart } from "react-icons/fa";

export default function Headbar() {
  const location = useLocation();
  const pageName =
    location.pathname === "/"
      ? "Home"
      : location.pathname.split("/")[1].replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg">
      <div className="flex items-center space-x-2 animate-fadeIn">
        <FaHeart className="h-6 w-6 text-white" />
        <span className="text-lg font-bold">
          Unistudents Match / {pageName}
        </span>
      </div>
    </div>
  );
}
