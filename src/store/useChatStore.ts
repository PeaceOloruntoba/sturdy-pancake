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
  status?: "sending" | "sent" | "delivered" | "read";
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
  markMessageAsRead: (
    messageId: string,
    readerId: string,
    senderId: string
  ) => Promise<void>;
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
          const updatedMessage =
            message.senderId === userId
              ? { ...message, status: "delivered" }
              : message;
          return { messages: [...state.messages, updatedMessage] };
        }
        return state;
      });
      get().fetchChats();
    });

    socket.on("messageRead", ({ messageId, readerId }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === messageId ? { ...msg, status: "read" } : msg
        ),
      }));
      throw readerId;
    });

    socket.on("disconnect", () => {
      set({ socket: null });
    });

    socket.on("connect_error", (error) => {
      toast.error("Socket connection failed. Please try again.");
      throw error;
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
    const tempId = Date.now().toString();
    const senderId = (get().socket as any)?.userId;

    if (!senderId) {
      toast.error("User not authenticated for sending message.");
      return;
    }

    const tempMessage: Message = {
      id: tempId,
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    set((state) => ({
      messages: [...state.messages, tempMessage],
    }));

    try {
      const response = await api.post("/api/chats/messages", {
        receiverId,
        content,
      });

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === tempId ? { ...response.data, status: "sent" } : msg
        ),
      }));

      const socket = get().socket;
      if (socket) {
        socket.emit("newMessage", { ...response.data, status: "sent" });
      }
      toast.success("Message sent");
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== tempId),
      }));
      toast.error("Failed to send message");
    }
  },
  markMessageAsRead: async (
    messageId: string,
    readerId: string,
    senderId: string
  ) => {
    try {
      await api.post("/api/chats/messages/read", { messageId, readerId });
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === messageId ? { ...msg, status: "read" } : msg
        ),
      }));
      const socket = get().socket;
      if (socket) {
        socket.emit("messageRead", { messageId, readerId, senderId });
      }
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  },
}));
