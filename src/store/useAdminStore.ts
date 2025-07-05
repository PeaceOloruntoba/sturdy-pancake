import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

interface AdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  university: string;
  isStudent: boolean;
  isGraduate: boolean;
  description: string;
  lookingFor: string;
  gender: "Male" | "Female";
  guardianEmail?: string;
  guardianPhone?: string;
  profilePictureUrl?: string;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateProfileData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  age: number;
  university: string;
  isStudent: boolean;
  isGraduate: boolean;
  description: string;
  lookingFor: string;
  gender: "Male" | "Female";
  guardianEmail?: string;
  guardianPhone?: string;
  isAdmin: boolean;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  age?: number;
  university?: string;
  isStudent?: boolean;
  isGraduate?: boolean;
  description?: string;
  lookingFor?: string;
  gender?: "Male" | "Female";
  guardianEmail?: string | null;
  guardianPhone?: string | null;
  isAdmin?: boolean;
  hasActiveSubscription?: boolean;
}

interface AdminState {
  profiles: AdminProfile[];
  isLoading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
  createProfile: (profileData: CreateProfileData) => Promise<boolean>;
  updateProfile: (
    profileId: string,
    profileData: UpdateProfileData
  ) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, _get) => ({
      profiles: [],
      isLoading: false,
      error: null,
      fetchProfiles: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get("/api/admin/profiles");
          set({ profiles: response.data, isLoading: false });
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || "Failed to fetch profiles.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },
      createProfile: async (profileData: CreateProfileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/admin/profiles", profileData);
          set((state) => ({
            profiles: [...state.profiles, response.data],
            isLoading: false,
          }));
          toast.success("Profile created successfully!");
          return true;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || "Failed to create profile.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return false;
        }
      },
      updateProfile: async (
        profileId: string,
        profileData: UpdateProfileData
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put(
            `/api/admin/profiles/${profileId}`,
            profileData
          );
          set((state) => ({
            profiles: state.profiles.map((p) =>
              p.id === profileId ? { ...p, ...response.data } : p
            ),
            isLoading: false,
          }));
          toast.success("Profile updated successfully!");
          return true;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || "Failed to update profile.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          return false;
        }
      },
    }),
    {
      name: "admin-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profiles: state.profiles,
      }),
    }
  )
);