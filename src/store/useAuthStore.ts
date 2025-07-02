import { create } from "zustand";
import api from "../utils/api";

interface User {
  gender: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  register: (userData: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSubscriptionStatus: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/register", userData);
      const { token, userId } = response.data;
      set({
        user: {
          id: userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isAdmin: false,
          hasActiveSubscription: false,
        },
        token,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, userId, hasActiveSubscription } = response.data;
      set({
        user: {
          id: userId,
          email,
          firstName: "",
          lastName: "",
          isAdmin: false,
          hasActiveSubscription,
        },
        token,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: () => {
    set({ user: null, token: null, isLoading: false, error: null });
  },
  setSubscriptionStatus: (status: boolean) => {
    set((state) => ({
      user: state.user
        ? { ...state.user, hasActiveSubscription: status }
        : null,
    }));
  },
}));
