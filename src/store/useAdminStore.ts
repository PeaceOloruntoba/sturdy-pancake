import { create } from "zustand";
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
  guardianPhoneNumber?: string;
  profilePictureUrl?: string;
  isAdmin: boolean; // Added isAdmin to the profile interface
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
  guardianPhoneNumber?: string;
  isAdmin: boolean; // Added isAdmin for creation
}

interface AdminState {
  profiles: AdminProfile[];
  isLoading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
  createProfile: (profileData: CreateProfileData) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set, _get) => ({
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
}));
