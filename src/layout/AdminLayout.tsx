import { Outlet } from "react-router";
import Headbar from "../components/Headbar";
import AdminSide from "../components/AdminSide";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="md:hidden fixed top-5 right-5 z-50 p-2 border border-white bg-rose-600 text-white rounded-lg"
        onClick={toggleSidebar}
      >
        <FaBars className="h-5 w-5" />
      </button>
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 md:w-1/4 bg-gray-900 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <AdminSide onToggle={toggleSidebar} />
      </div>
      {/* Main Content */}
      <div className="flex flex-col w-full md:w-3/4 h-full">
        <Headbar />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fadeIn">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
