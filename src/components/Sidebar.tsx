import { Link } from "react-router";

export default function Sidebar() {
  return (
    <div className="min-h-screen bg-black/80 p-12">
      <div className="flex flex-col">
        <Link to={"/dashboad"}></Link>
        <Link to={"/chats"}></Link>
        <Link to={"/profile"}></Link>
        <button>Logout</button>
        <button>Share</button>
      </div>
    </div>
  );
}
