import { useState, useEffect } from "react";
import { FaComments } from "react-icons/fa";
import { useAuthStore } from "../../store/useAuthStore";
import { Filter } from "bad-words";

const filter = new Filter();

interface Chat {
  id: string;
  user: { id: string; firstName: string; lastName: string };
  lastMessage: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export default function Chats() {
  const { user } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Mock data (to be replaced with API call)
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: "1",
        user: { id: "1", firstName: "Jane", lastName: "Doe" },
        lastMessage: "Hey, how’s it going?",
      },
      {
        id: "2",
        user: { id: "2", firstName: "Alice", lastName: "Smith" },
        lastMessage: "Let’s study together!",
      },
    ];
    setChats(mockChats);
  }, []);

  // Mock messages for selected chat
  useEffect(() => {
    if (selectedChat) {
      const mockMessages: Message[] = [
        {
          id: "1",
          senderId: "1",
          content: "Hey, how’s it going?",
          timestamp: "2025-07-02 14:00",
        },
        {
          id: "2",
          senderId: user?.id || "",
          content: "Pretty good, you?",
          timestamp: "2025-07-02 14:05",
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedChat, user]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      return;
    }
    const cleanedMessage = filter.clean(newMessage);
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        senderId: user?.id || "",
        content: cleanedMessage,
        timestamp: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
    // TODO: Send message to backend via Socket.IO
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg animate-fadeIn h-full flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3 bg-gray-100 rounded-lg p-4 animate-slideIn">
        <h3 className="text-xl font-bold mb-4">Chats</h3>
        {chats.map((chat) => (
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
        ))}
      </div>
      <div className="w-full md:w-2/3 flex flex-col h-full">
        {selectedChat ? (
          <>
            <h3 className="text-xl font-bold mb-4 p-3 bg-rose-600 text-white rounded-t-lg">
              Chat with {selectedChat.user.firstName}{" "}
              {selectedChat.user.lastName}
            </h3>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-b-lg">
              {messages.map((msg) => (
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
              ))}
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
