import { logo } from "../assets";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
                <img src={logo} alt="" className="w-12 h-12" />
          <span className="text-xl font-bold">Unistudents Match</span>
        </div>
        <p className="text-gray-400">
          Connecting Muslim university students and graduates worldwide
        </p>
      </div>
    </footer>
  );
}
