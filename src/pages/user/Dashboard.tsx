import { useState, useEffect } from "react";
import { FaComments, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useDashboardStore } from "../../store/useDashboardStore";
import { Filter } from "bad-words";
import { toast } from "sonner";

const filter = new Filter();

interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  lookingFor: string;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const { users, isLoading, fetchUsers, requestPhotoAccess } =
    useDashboardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUsers(user.gender);
    }
  }, [user, fetchUsers]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    const cleanedMessage = filter.clean(message);
    toast.success(`Message modal opened for ${selectedUser?.firstName}`);
    setMessage("");
    setIsModalOpen(false);
    if (selectedUser) {
      navigate(
        `/chats?userId=${selectedUser.id}&initialMessage=${encodeURIComponent(
          cleanedMessage
        )}`
      );
    }
  };

  const handleRequestPhoto = async (targetUserId: string) => {
    await requestPhotoAccess(targetUserId);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Matches</h2>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-rose-600 text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Looking For</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-rose-50 transition-all duration-300"
                >
                  <td className="p-3">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="p-3">{u.age}</td>
                  <td className="p-3">{u.lookingFor}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setIsModalOpen(true);
                      }}
                      className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 hover:scale-110 transition-all duration-300"
                      title="Message"
                    >
                      <FaComments className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleRequestPhoto(u.id)}
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 transition-all duration-300"
                      title="Request Photos"
                    >
                      <FaImage className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Send Message to {selectedUser?.firstName}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
              placeholder="Type your message..."
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
