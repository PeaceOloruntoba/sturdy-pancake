// store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api"; // Assuming this is your Axios instance or fetch wrapper

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  // Add subscription status to the User interface so it can be accessed for redirection
  subscription?: {
    status: string;
    startDate: Date;
    trialEndsAt: Date;
    lastPaymentDate?: Date;
    nextBillingDate?: Date;
    cardDetails?: {
      last4?: string;
      processor?: string;
      paypalOrderId?: string;
    };
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  // Updated register signature to only accept core user data
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
  logout: () => void;
  // New action to update user data in the store, useful after subscription
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
          const { token, userId } = response.data;
          const userResponse = await api.get(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({
            user: {
              id: userId,
              email: userResponse.data.email, // Ensure email is from response
              firstName: userResponse.data.firstName,
              lastName: userResponse.data.lastName,
              isAdmin: userResponse.data.isAdmin,
              subscription: userResponse.data.subscription, // Fetch subscription status on login
            },
            token,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },
      register: async (formData: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/register", formData);
          const { token, userId } = response.data;
          // After registration, fetch the full user details including initial subscription status
          const userResponse = await api.get(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            user: {
              id: userId,
              email: userResponse.data.email, // Get email from fetched user data
              firstName: userResponse.data.firstName,
              lastName: userResponse.data.lastName,
              isAdmin: userResponse.data.isAdmin, // Get isAdmin from fetched user data
              subscription: userResponse.data.subscription, // Get initial subscription status
            },
            token,
            isLoading: false,
          });
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
