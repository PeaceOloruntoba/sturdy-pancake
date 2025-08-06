import { useEffect, useState, useRef } from "react";
import { FaComments } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { Filter } from "bad-words";
import { toast } from "sonner";

const filter = new Filter();

interface Chat {
  id: string;
  user: { id: string; firstName: string; lastName: string };
  lastMessage: string;
  timestamp: string;
}

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
            `No existing chat found for user ID: ${targetUserIdFromUrl}.`
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
          markMessageAsRead(msg.id, user.id, msg.senderId);
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

  return (
    <div className="h-full p-4 sm:p-6">
      <div className="p-4 bg-white w-full rounded-lg shadow-lg animate-fadeIn h-full flex flex-col relative">
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
          <div className="w-full md:w-2/3 flex flex-col pb-16">
            {selectedChat ? (
              <>
                <h3 className="text-lg sm:text-xl font-bold mb-4 p-2 sm:p-3 bg-rose-600 text-white rounded-t-lg">
                  Chat with {selectedChat.user.firstName}{" "}
                  {selectedChat.user.lastName}
                </h3>
                <div className="flex-1 overflow-y-scroll p-2 sm:p-4 bg-gray-50 rounded-b-lg">
                  {isLoading ? (
                    <div className="text-center text-sm sm:text-base">
                      Loading messages...
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
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
                                  ✓
                                </span>
                              )}
                              {msg.status === "delivered" && (
                                <span className="font-bold text-blue-600">
                                  ✓✓
                                </span>
                              )}
                              {msg.status === "read" && (
                                <span className="font-bold text-green-600">
                                  ✓✓
                                </span>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-2 sm:p-4 flex gap-2 bg-white absolute bottom-0 left-0 right-0">
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
    </div>
  );
}
