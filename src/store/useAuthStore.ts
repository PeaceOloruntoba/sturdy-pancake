import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  hasActiveSubscription?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
    university: string;
    status: string;
    description: string;
    lookingFor: string;
    guardianEmail?: string;
    guardianPhone?: string;
    agreeTerms: boolean;
  }) => Promise<void>;
  subscribe: (paymentDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          const { token, userId, hasActiveSubscription } = response.data;
          set({
            user: {
              id: userId,
              email,
              firstName: response.data.firstName || "",
              lastName: response.data.lastName || "",
              isAdmin: response.data.isAdmin || false,
              hasActiveSubscription: hasActiveSubscription || false,
            },
            token,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },
      register: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/register", formData);
          const { token, userId } = response.data;
          set({
            user: {
              id: userId,
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              isAdmin: false,
              hasActiveSubscription: false,
            },
            token,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },
      subscribe: async (paymentDetails) => {
        set({ isLoading: true, error: null });
        try {
          await api.post(
            "/auth/subscribe",
            { paymentDetails },
            {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`,
              },
            }
          );
          set((state) => ({
            user: state.user
              ? { ...state.user, hasActiveSubscription: true }
              : null,
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },
      logout: () => {
        set({ user: null, token: null, error: null });
      },
      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
