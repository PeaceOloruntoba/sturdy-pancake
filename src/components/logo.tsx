import { logo } from "../assets";

export default function Logo() {
  return (
    <div className="flex flex-col items-center w-fit">
      <img
        src={logo}
        alt="Unistudents Match Logo"
        className="w-12 h-12 sm:w-14 sm:h-14"
      />
      <span className="text-xl sm:text-2xl font-bold text-gray-100">
        Unistudents Match
      </span>
    </div>
  );
}