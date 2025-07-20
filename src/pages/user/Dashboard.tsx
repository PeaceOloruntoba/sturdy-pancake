import { useState, useEffect } from "react";
import { FaComments, FaImage, FaTimes } from "react-icons/fa"; // Added FaTimes for close button
import { useNavigate } from "react-router"; // Use react-router-dom
import { useAuthStore } from "../../store/useAuthStore";
import { useDashboardStore } from "../../store/useDashboardStore";
import { useChatStore } from "../../store/useChatStore";
import UserProfileDetail from "./UserProfileDetail"; // Import the new detailed profile component
import { Filter } from "bad-words";
import { toast } from "sonner";

const filter = new Filter();

interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  university: string; // Added for display
  status: string; // Added for display
  description: string; // Added for detailed view
  lookingFor: string; // Added for detailed view
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const { users, isLoading, fetchUsers } = useDashboardStore(); // Removed requestPhotoAccess from here
  const { sendMessage } = useChatStore();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false); // State for profile detail modal
  const [selectedUserForMessage, setSelectedUserForMessage] = useState<User | null>(null);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null); // State for detailed user
  const [messageContent, setMessageContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUsers(user.gender); // Pass user's gender to fetch opposite gender users
    }
  }, [user, fetchUsers]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (!selectedUserForMessage) {
      toast.error("No user selected to send message to.");
      return;
    }

    const cleanedMessage = filter.clean(messageContent);

    await sendMessage(selectedUserForMessage.id, cleanedMessage);

    toast.success(`Message sent to ${selectedUserForMessage.firstName}. Opening chat.`);
    setMessageContent("");
    setIsMessageModalOpen(false);

    navigate(`/chats?userId=${selectedUserForMessage.id}`);
  };

  const openMessageModal = (user: User) => {
    setSelectedUserForMessage(user);
    setIsMessageModalOpen(true);
  };

  const openProfileDetail = (user: User) => {
    setSelectedUserForDetail(user);
    setIsProfileDetailOpen(true);
  };

  const closeProfileDetail = () => {
    setIsProfileDetailOpen(false);
    setSelectedUserForDetail(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg animate-fadeIn relative"> {/* Added relative for modal positioning */}
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
                <th className="p-3 text-left">University</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-600">No matches found.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b hover:bg-rose-50 transition-all duration-300 cursor-pointer"
                    onClick={() => openProfileDetail(u)} // Click row to open detail
                  >
                    <td className="p-3">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-3">{u.age}</td>
                    <td className="p-3">{u.university}</td>
                    <td className="p-3">{u.status}</td>
                    <td className="p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click from triggering
                          openMessageModal(u);
                        }}
                        className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 hover:scale-110 transition-all duration-300"
                        title="Message"
                      >
                        <FaComments className="h-5 w-5" />
                      </button>
                      {/* Photo request button is now only on the detailed view */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center animate-fadeIn z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Send Message to {selectedUserForMessage?.firstName}
            </h3>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
              placeholder="Type your message..."
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsMessageModalOpen(false)}
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

      {/* Profile Detail Sliding Modal */}
      {isProfileDetailOpen && selectedUserForDetail && (
        <div className={`fixed inset-0 z-40 overflow-hidden`}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeProfileDetail}></div>
          <div className={`fixed right-0 top-0 h-full w-full md:w-1/2 lg:w-1/3 bg-white shadow-xl transform transition-transform duration-300 ease-out ${isProfileDetailOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 h-full overflow-y-auto">
              <button onClick={closeProfileDetail} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl">
                <FaTimes />
              </button>
              {/* Pass the selected user's ID to the UserProfileDetail component */}
              <UserProfileDetail userId={selectedUserForDetail.id} onClose={closeProfileDetail} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
