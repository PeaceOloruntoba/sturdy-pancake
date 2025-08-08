import { useEffect, useState } from "react";
import { FaComments, FaImage, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useDashboardStore } from "../../store/useDashboardStore";
import { useChatStore } from "../../store/useChatStore";
import { Filter } from "bad-words";
import { toast } from "sonner";
import UserProfileDetail from "./UserProfileDetail";

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
  const { sendMessage } = useChatStore();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserIdForProfile, setSelectedUserIdForProfile] = useState<
    string | null
  >(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUsers(user.gender);
    }
  }, [user, fetchUsers]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (!selectedUser) {
      toast.error("No user selected to send message to.");
      return;
    }
    if (!user?.id) {
      toast.error("Your user ID is not available. Please log in again.");
      return;
    }

    const cleanedMessage = filter.clean(message);
    await sendMessage(user.id, selectedUser.id, cleanedMessage);
    toast.success(`Message sent to ${selectedUser.firstName}. Opening chat.`);
    setMessage("");
    setIsMessageModalOpen(false);
    navigate(`/chats?userId=${selectedUser.id}`);
  };

  const handleRequestPhoto = async (targetUserId: string) => {
    await requestPhotoAccess(targetUserId);
  };

  const openProfileModal = (userId: string) => {
    setSelectedUserIdForProfile(userId);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedUserIdForProfile(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Find Matches
        </h2>
        <input
          type="search"
          className="p-2 border border-gray-900 rounded-lg sm:w-md"
          placeholder="Search by name..."
        />
      </div>
      {isLoading ? (
        <div className="text-center text-base sm:text-lg">Loading...</div>
      ) : (
        <div className="space-y-4 sm:overflow-x-auto">
          {/* Mobile: Card Layout, Desktop: Table */}
          <div className="block sm:hidden space-y-4">
            {users.map((u) => (
              <div
                key={u.id}
                onClick={() => openProfileModal(u.id)}
                className="p-4 border rounded-lg hover:bg-rose-50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-base">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{u.age} years old</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(u);
                        setIsMessageModalOpen(true);
                      }}
                      className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-all"
                      title="Message"
                    >
                      <FaComments className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestPhoto(u.id);
                      }}
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all"
                      title="Request Photos"
                    >
                      <FaImage className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: Table Layout */}
          <table className="hidden sm:table w-full border-collapse">
            <thead>
              <tr className="bg-rose-600 text-white">
                <th className="p-2 sm:p-3 text-left text-sm sm:text-base">
                  Name
                </th>
                <th className="p-2 sm:p-3 text-left text-sm sm:text-base">
                  Age
                </th>
                <th className="p-2 sm:p-3 text-left text-sm sm:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => openProfileModal(u.id)}
                  className="border-b hover:bg-rose-50 transition-all duration-300 cursor-pointer"
                >
                  <td className="p-2 sm:p-3 text-sm sm:text-base">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="p-2 sm:p-3 text-sm sm:text-base">{u.age}</td>
                  <td
                    className="p-2 sm:p-3 flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setIsMessageModalOpen(true);
                      }}
                      className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-all"
                      title="Message"
                    >
                      <FaComments className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                    <button
                      onClick={() => handleRequestPhoto(u.id)}
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all"
                      title="Request Photos"
                    >
                      <FaImage className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center animate-fadeIn z-40">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:max-w-sm">
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              Send Message to {selectedUser?.firstName}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 text-sm sm:text-base"
              placeholder="Type your message..."
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="px-3 sm:px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-3 sm:px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all text-sm sm:text-base"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Profile Detail Modal */}
      {isProfileModalOpen && selectedUserIdForProfile && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeProfileModal}
          ></div>
          <div className="fixed inset-y-0 left-0 w-2/3 h-full bg-white shadow-xl transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              <button
                onClick={closeProfileModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl sm:text-2xl"
              >
                <FaTimes />
              </button>
              <UserProfileDetail
                userId={selectedUserIdForProfile}
                onClose={closeProfileModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
