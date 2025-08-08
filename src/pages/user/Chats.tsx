import { useEffect, useState, useRef } from "react";
import { FaComments, FaArrowRight, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { Filter } from "bad-words";
import { toast } from "sonner";
import UserProfileDetail from "./UserProfileDetail";

const filter = new Filter();

interface Chat {
  id: string;
  user: { id: string; firstName: string; lastName: string };
  lastMessage: string;
  timestamp: string;
}

// interface Message {
//   _id: string;
//   senderId: string;
//   receiverId: string;
//   content: string;
//   timestamp: string;
//   status: "sending" | "sent" | "delivered" | "read";
// }

export default function Chats() {
  const { user } = useAuthStore();
  const {
    chats,
    messages,
    isLoading,
    initializeSocket,
    disconnectSocket,
    fetchChats,
    fetchMessages,
    sendMessage,
    markMessageAsRead,
  } = useChatStore();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isChatListOpen, setIsChatListOpen] = useState(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUserIdForProfile, setSelectedUserIdForProfile] = useState<
    string | null
  >(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      initializeSocket(user.id);
      fetchChats();
      return () => {
        disconnectSocket();
      };
    }
  }, [user, initializeSocket, disconnectSocket, fetchChats]);

  useEffect(() => {
    if (user && chats.length > 0) {
      const params = new URLSearchParams(location.search);
      const targetUserIdFromUrl = params.get("userId");
      if (targetUserIdFromUrl) {
        const chatToSelect = chats.find(
          (c) => c.user.id === targetUserIdFromUrl
        );
        if (chatToSelect) {
          setSelectedChat(chatToSelect);
          setIsChatListOpen(false);
        } else {
          console.warn(
            `No existing chat found for user ID: ${targetUserIdFromUrl}. Initiating new chat if applicable.`
          );
        }

        navigate(location.pathname, { replace: true });
      }
    }
  }, [user, chats, location.search, navigate]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.user.id);
    }
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (user && selectedChat) {
      messages.forEach((msg) => {
        if (
          msg.receiverId === user.id &&
          msg.status !== "read" &&
          msg.status !== "sending"
        ) {
          markMessageAsRead(msg._id, user.id, msg.senderId);
        }
      });
    }
  }, [messages, user, selectedChat, markMessageAsRead]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user?.id) {
      toast.error("Message cannot be empty or no chat selected.");
      return;
    }
    const cleanedMessage = filter.clean(newMessage);
    await sendMessage(user.id, selectedChat.user.id, cleanedMessage);
    setNewMessage("");
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
    <div className="h-full p-4 sm:p-6">
      <div className="p-4 bg-white w-full rounded-lg shadow-lg animate-fadeIn h-fit flex flex-col relative">
        {/* Mobile chat list toggle button */}
        <button
          className="md:hidden mb-4 p-2 bg-rose-600 text-white rounded-lg flex items-center gap-2"
          onClick={() => setIsChatListOpen(!isChatListOpen)}
        >
          <FaComments className="h-4 sm:h-5 w-4 sm:w-5" />
          {isChatListOpen ? "Hide Chats" : "Show Chats"}
        </button>
        <div className="flex flex-col md:flex-row gap-4 h-full">
          {/* Chat List */}
          <div
            className={`${
              isChatListOpen ? "block" : "hidden"
            } md:block w-full md:w-1/3 bg-gray-100 rounded-lg p-4 animate-slideIn`}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4">Chats</h3>
            {isLoading ? (
              <div className="text-center text-sm sm:text-base">Loading...</div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat);
                    setIsChatListOpen(false);
                  }}
                  className={`p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-rose-600 hover:text-white transition-all duration-300 text-sm sm:text-base ${
                    selectedChat?.id === chat.id ? "bg-rose-600 text-white" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaComments className="h-4 sm:h-5 w-4 sm:w-5" />
                    <div>
                      <p className="font-semibold">
                        {chat.user.firstName} {chat.user.lastName}
                      </p>
                      <p className="text-xs sm:text-sm truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Chat Messages */}
          <div className="w-full md:w-2/3 flex flex-col pb-16 overflow-y-auto">
            {selectedChat ? (
              <>
                {/* Chat header with profile view option */}
                <h3 className="text-lg sm:text-xl font-bold mb-4 p-2 sm:p-3 bg-rose-600 text-white rounded-t-lg flex items-center justify-between">
                  Chat with {selectedChat.user.firstName}{" "}
                  {selectedChat.user.lastName}
                  <button
                    onClick={() => openProfileModal(selectedChat.user.id)}
                    className="ml-2 p-1 rounded-full bg-white text-rose-600 hover:bg-rose-100 transition-all"
                    title={`View ${selectedChat.user.firstName}'s Profile`}
                  >
                    <FaArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
                  </button>
                </h3>
                {/* Message display area */}
                <div className="flex-1 p-2 sm:p-4 bg-gray-50 rounded-b-lg overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center text-sm sm:text-base">
                      Loading messages...
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg max-w-[80%] sm:max-w-[70%] ${
                          msg.senderId === user?.id
                            ? "ml-auto bg-rose-600 text-white"
                            : "mr-auto bg-gray-200"
                        }`}
                      >
                        <p className="text-sm sm:text-base">{msg.content}</p>
                        <p className="text-xs opacity-70 flex items-center gap-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                          {msg.senderId === user?.id && (
                            <>
                              {msg.status === "sending" && (
                                <span className="hidden"></span>
                              )}
                              {msg.status === "sent" && (
                                <span className="font-bold text-gray-600">
                                  ✓ {/* Single checkmark for sent */}
                                </span>
                              )}
                              {msg.status === "delivered" && (
                                <span className="font-bold text-blue-600">
                                  ✓✓ {/* Double checkmark for delivered */}
                                </span>
                              )}
                              {msg.status === "read" && (
                                <span className="font-bold text-green-600">
                                  ✓✓ {/* Double checkmark, green for read */}
                                </span>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} /> {/* Scroll target */}
                </div>
                {/* Message input area */}
                <div className="p-2 sm:p-4 flex gap-2 bg-white fixed bottom-0 left-0 right-0 z-10">
                  {" "}
                  {/* Added z-10 */}
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 text-sm sm:text-base"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-3 sm:px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all text-sm sm:text-base"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Profile Detail Modal - Rendered conditionally */}
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
