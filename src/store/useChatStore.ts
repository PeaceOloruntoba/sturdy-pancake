import { create } from "zustand";
import api from "../utils/api";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
// import { useAuthStore } from "./useAuthStore"; // Import useAuthStore

interface Chat {
  id: string;
  user: { id: string; firstName: string; lastName: string };
  lastMessage: string;
  timestamp: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface ChatState {
  chats: Chat[];
  messages: Message[];
  isLoading: boolean;
  socket: Socket | null;
  initializeSocket: (userId: string) => void;
  fetchChats: () => Promise<void>;
  fetchMessages: (otherUserId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: [],
  isLoading: false,
  socket: null,
  initializeSocket: (userId: string) => {
    // Access the token using useAuthStore.getState() inside the function
    // const { token } = useAuthStore.getState(); // Token is not used directly in the io constructor for now

    const socket = io(import.meta.env.VITE_API_URL, {
      // Explicitly define the path for Socket.IO.
      // This should match the default path where Socket.IO is mounted on the server.
      path: "/socket.io/",
      // Removed the auth object as the server is not currently configured to handle it
      // auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join", userId);
    });

    socket.on("newMessage", (message: Message) => {
      set((state) => ({
        messages: state.messages.some((m) => m.id === message.id)
          ? state.messages
          : [...state.messages, message],
      }));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    set({ socket });
  },
  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/api/chats");
      set({ chats: response.data });
    } catch (error) {
      toast.error("Failed to fetch chats");
      console.error("Fetch chats error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMessages: async (otherUserId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/api/chats/messages/${otherUserId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error("Failed to fetch messages");
      console.error("Fetch messages error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  sendMessage: async (receiverId: string, content: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/api/chats/messages", {
        receiverId,
        content,
      });
      set((state) => ({
        messages: [...state.messages, response.data],
      }));
      const socket = get().socket;
      if (socket) {
        // When emitting, ensure you are sending the full message object
        // as expected by your backend's socket.on("newMessage") listener.
        // The backend's `sendMessage` route returns the full message object,
        // so `response.data` is suitable here.
        socket.emit("newMessage", response.data);
      }
      toast.success("Message sent");
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Send message error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
