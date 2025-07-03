import { create } from "zustand";
import api from "../utils/api";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

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
  initializeSocket: (userId: string, token: string) => void;
  fetchChats: () => Promise<void>;
  fetchMessages: (otherUserId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: [],
  isLoading: false,
  socket: null,
  initializeSocket: (userId: string, token: string) => {
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
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
