import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

interface ProfileState {
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    university: string;
    status: string;
    description: string;
    lookingFor: string;
    guardianEmail?: string;
    guardianPhone?: string;
  };
  photos: { id: string; url: string; createdAt: string }[];
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileState["profile"]>) => Promise<void>;
  uploadPhoto: (photo: File) => Promise<void>;
  fetchPhotos: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {
        firstName: "",
        lastName: "",
        age: 18,
        gender: "",
        university: "",
        status: "",
        description: "",
        lookingFor: "",
      },
      photos: [],
      isLoading: false,
      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get("/api/users/profile");
          set({ profile: response.data });
        } catch (error) {
          toast.error("Failed to fetch profile");
          console.error("Fetch profile error:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      updateProfile: async (data: Partial<ProfileState["profile"]>) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/api/users/profile", data);
          set({ profile: response.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          toast.error("Failed to update profile");
          console.error("Update profile error:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      uploadPhoto: async (photo: File) => {
        set({ isLoading: true });
        try {
          const reader = new FileReader();
          reader.readAsDataURL(photo);
          await new Promise((resolve) => (reader.onload = resolve));
          const base64Photo = reader.result as string;
          const response = await api.post("/api/photos", {
            photo: base64Photo,
          });
          set((state) => ({
            photos: [
              ...state.photos,
              {
                id: response.data.photoId,
                url: response.data.url,
                createdAt: new Date().toISOString(),
              },
            ],
          }));
          toast.success("Photo uploaded successfully");
        } catch (error) {
          toast.error("Failed to upload photo");
          console.error("Upload photo error:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      fetchPhotos: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get("/api/photos");
          set({ photos: response.data });
        } catch (error) {
          toast.error("Failed to fetch photos");
          console.error("Fetch photos error:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        photos: state.photos,
      }),
    }
  )
);
