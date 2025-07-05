import { Outlet } from "react-router";
import Headbar from "../components/Headbar";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-gray-100">
      <div className="w-full md:w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full md:w-3/4 h-full">
        <Headbar />
        <div className="flex-1 overflow-y-auto p-4 animate-fadeIn">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
