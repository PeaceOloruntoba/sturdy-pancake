import { useLocation } from "react-router";
import Logo from "./Logo.tsx";

export default function Headbar() {
  const location = useLocation();
  const pageName =
    location.pathname === "/"
      ? "Home"
      : location.pathname.split("/")[1].replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg">
      <div className="flex items-center space-x-2 animate-fadeIn">
        <Logo />
        <span className="text-lg font-semibold">
          <span className="underline cursor-pointer">Unistudents Match/</span>
          <br /> <p className="text-sm font-bold"> {pageName}</p>
        </span>
      </div>
    </div>
  );
}
