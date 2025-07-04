import { create } from "zustand";
import api from "../utils/api";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

interface Chat {
  id: string; // This is the conversation ID from MongoDB's _id for the grouped messages
  user: { id: string; firstName: string; lastName: string }; // This user.id is the other participant's ID
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
  disconnectSocket: () => void; // Re-added for cleanup
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
    // Prevent re-initialization if a socket is already connected and for the same user
    if (
      currentSocket &&
      currentSocket.connected &&
      (currentSocket as any).userId === userId
    ) {
      console.log(
        "Socket already connected for this user, skipping re-initialization."
      );
      return;
    }

    // Disconnect any existing socket before creating a new one
    if (currentSocket) {
      console.log("Disconnecting existing socket before new initialization.");
      currentSocket.disconnect();
      set({ socket: null });
    }

    console.log("Attempting to initialize socket for userId:", userId);
    const socket = io(import.meta.env.VITE_API_URL, {
      path: "/socket.io/",
      // auth: { token }, // Re-add if server-side auth middleware is implemented
    });

    // Store userId on the socket instance for the check above
    (socket as any).userId = userId;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join", userId);
    });

    socket.on("newMessage", (message: Message) => {
      set((state) => {
        // Update messages if it's for the currently selected chat
        const selectedChatId =
          get().messages[0]?.receiverId === userId
            ? get().messages[0]?.senderId
            : get().messages[0]?.receiverId;
        const isForCurrentChat =
          (message.senderId === selectedChatId &&
            message.receiverId === userId) ||
          (message.senderId === userId &&
            message.receiverId === selectedChatId);

        if (isForCurrentChat) {
          return {
            messages: state.messages.some((m) => m.id === message.id)
              ? state.messages
              : [...state.messages, message],
          };
        } else {
          // You might want to update the lastMessage in the chats list for this conversation
          // Or show a notification for a new message in a different chat
          console.log("Received message for another chat:", message);
          return state; // No change to current messages if not for selected chat
        }
      });
      // Optionally, refetch chats to update last message if the new message is for an existing chat
      get().fetchChats();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      set({ socket: null });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Socket connection failed. Please try again.");
    });

    set({ socket });
  },
  disconnectSocket: () => {
    // Re-added
    const currentSocket = get().socket;
    if (currentSocket) {
      console.log("Disconnecting socket:", currentSocket.id);
      currentSocket.disconnect();
      set({ socket: null });
    }
  },
  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/api/chats"); // Corrected API path
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
      const response = await api.get(`/api/chats/messages/${otherUserId}`); // Corrected API path
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
        // Corrected API path
        receiverId,
        content,
      });
      set((state) => ({
        messages: [...state.messages, response.data],
      }));
      const socket = get().socket;
      if (socket) {
        // Emit the full message object as returned by the backend
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
