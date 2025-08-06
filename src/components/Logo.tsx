import { logo } from "../assets";

export default function Logo() {
  return (
    <div className="flex flex-col items-center w-fit">
      <img src={logo} alt="Unistudents Match Logo" className="w-18 h-12" />
      <span className="text-[10px] text-gray-100">UNISTUDENTSMATCH</span>
    </div>
  );
}
