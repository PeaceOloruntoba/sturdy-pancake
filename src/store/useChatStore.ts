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
  initializeSocket: (userId: string) => void;
  disconnectSocket: () => void;
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
    const currentSocket = get().socket;
    if (
      currentSocket &&
      currentSocket.connected &&
      (currentSocket as any).userId === userId
    ) {
      return;
    }

    if (currentSocket) {
      currentSocket.disconnect();
      set({ socket: null });
    }

    const socket = io(import.meta.env.VITE_API_URL, {
      path: "/socket.io/",
    });

    (socket as any).userId = userId;

    socket.on("connect", () => {
      socket.emit("join", userId);
    });

    socket.on("newMessage", (message: Message) => {
      set((state) => {
        const isDuplicate = state.messages.some((m) => m.id === message.id);
        if (!isDuplicate) {
          return { messages: [...state.messages, message] };
        }
        return state;
      });
      get().fetchChats();
    });

    socket.on("disconnect", () => {
      set({ socket: null });
    });

    socket.on("connect_error", (error) => {
      toast.error("Socket connection failed. Please try again.");
    });

    set({ socket });
  },
  disconnectSocket: () => {
    const currentSocket = get().socket;
    if (currentSocket) {
      currentSocket.disconnect();
      set({ socket: null });
    }
  },
  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/api/chats");
      set({ chats: response.data });
    } catch (error) {
      toast.error("Failed to fetch chats");
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
    } finally {
      set({ isLoading: false });
    }
  },
}));
