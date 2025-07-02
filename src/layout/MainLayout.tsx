import { Outlet } from "react-router";
import Headbar from "../components/Headbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="w-screen h-screen flex gap-4">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-4/5">
        <Headbar />
        <Outlet />
      </div>
    </div>
  );
}
