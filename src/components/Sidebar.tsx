import { Link } from "react-router";

export default function Sidebar() {
  return (
    <div className="min-h-screen bg-black/80 p-12 text-xl text-white">
      <div className="flex flex-col gap-4">
        <Link to={"/dashboad"}>Dashboard</Link>
        <Link to={"/chats"}>Chats</Link>
        <Link to={"/profile"}> Profile</Link>
        <button>Logout</button>
        <button>Share</button>
      </div>
    </div>
  );
}
