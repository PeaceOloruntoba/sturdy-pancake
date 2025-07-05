import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  lookingFor: string;
}

interface DashboardState {
  users: User[];
  isLoading: boolean;
  fetchUsers: (gender: string) => Promise<void>;
  requestPhotoAccess: (targetUserId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      users: [],
      isLoading: false,
      fetchUsers: async (gender: string) => {
        set({ isLoading: true });
        try {
          const response = await api.get("/api/users");
          const filteredUsers = response.data.filter(
            (u: User) => u.gender !== gender
          );
          set({ users: filteredUsers });
        } catch (error) {
          toast.error("Failed to fetch users");
          console.error("Fetch users error:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      requestPhotoAccess: async (targetUserId: string) => {
        set({ isLoading: true });
        try {
          await api.post("/api/photos/request", { targetUserId });
          toast.success("Photo access request sent");
        } catch (error) {
          toast.error("Failed to send photo access request");
          console.error("Request photo access error:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "dashboard-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
      }),
    }
  )
);
