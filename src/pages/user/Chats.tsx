import { useEffect, useRef, useState } from "react";
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

// interface Message {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   content: string;
//   timestamp: string;
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
  } = useChatStore();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
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
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) {
      toast.error("Message cannot be empty or no chat selected.");
      return;
    }
    const cleanedMessage = filter.clean(newMessage);
    await sendMessage(selectedChat.user.id, cleanedMessage);
    setNewMessage("");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg animate-fadeIn h-full flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3 bg-gray-100 rounded-lg p-4 animate-slideIn">
        <h3 className="text-xl font-bold mb-4">Chats</h3>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 rounded-lg cursor-pointer hover:bg-rose-600 hover:text-white transition-all duration-300 ${
                selectedChat?.id === chat.id ? "bg-rose-600 text-white" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <FaComments className="h-5 w-5" />
                <div>
                  <p className="font-semibold">
                    {chat.user.firstName} {chat.user.lastName}
                  </p>
                  <p className="text-sm truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="w-full md:w-2/3 flex flex-col h-full">
        {selectedChat ? (
          <>
            <h3 className="text-xl font-bold mb-4 p-3 bg-rose-600 text-white rounded-t-lg">
              Chat with {selectedChat.user.firstName}{" "}
              {selectedChat.user.lastName}
            </h3>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-b-lg">
              {isLoading ? (
                <div className="text-center">Loading messages...</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 p-3 rounded-lg max-w-[70%] ${
                      msg.senderId === user?.id
                        ? "ml-auto bg-rose-600 text-white"
                        : "mr-auto bg-gray-200"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
