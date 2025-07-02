import { Outlet } from "react-router";
import Headbar from "../components/Headbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="w-screen h-screen flex gap-4">
      <Sidebar />
      <div className="flex flex-col">
        <Headbar />
        <Outlet />
      </div>
    </div>
  );
}
