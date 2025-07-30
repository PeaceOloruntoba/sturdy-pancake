import { create } from "zustand";
import { toast } from "sonner";
import api from "../utils/api";

interface Photo {
  id: string;
  userId: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  createdAt: string;
}

interface PhotoRequest {
  _id: string;
  requesterId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  targetUserId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface ProfileWithPhotos {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  university: string;
  status: string;
  description: string;
  lookingFor: string;
  photos: { id: string; url: string }[];
  photoAccessStatus: 'restricted' | 'pending' | 'accepted' | 'rejected' | 'granted_self' | 'granted_by_request';
}

interface PhotoState {
  photos: Photo[];
  sentRequests: PhotoRequest[];
  receivedRequests: PhotoRequest[];
  isLoading: boolean;
  error: string | null;
  fetchPhotos: () => Promise<void>;
  uploadPhoto: (file: File) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  sendPhotoRequest: (targetUserId: string) => Promise<void>;
  fetchSentRequests: () => Promise<void>;
  fetchReceivedRequests: () => Promise<void>;
  respondToPhotoRequest: (requestId: string, status: "accepted" | "rejected") => Promise<void>;
  fetchUserProfileWithPhotos: (userId: string) => Promise<ProfileWithPhotos | null>;
}

export const usePhotoStore = create<PhotoState>((set) => ({
  photos: [],
  sentRequests: [],
  receivedRequests: [],
  isLoading: false,
  error: null,

  fetchPhotos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/api/photos");
      set({ photos: response.data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch photos";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  uploadPhoto: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/api/photos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        photos: [...state.photos, response.data.photo],
        isLoading: false,
      }));
      toast.success("Photo uploaded successfully!");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to upload photo";
      console.log(err)
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  deletePhoto: async (photoId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/photos/${photoId}`);
      set((state) => ({
        photos: state.photos.filter((photo) => photo.id !== photoId),
        isLoading: false,
      }));
      toast.success("Photo deleted successfully!");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to delete photo";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  sendPhotoRequest: async (targetUserId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/api/photos/request", { targetUserId });
      set((state) => ({
        sentRequests: [...state.sentRequests, response.data.request],
        isLoading: false,
      }));
      toast.success("Photo request sent!");
    } catch (err: any) {
      const message = err.message || "Failed to send photo request";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  fetchSentRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/api/photos/requests/sent");
      set({ sentRequests: response.data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch sent requests";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  fetchReceivedRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/api/photos/requests/received");
      set({ receivedRequests: response.data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch received requests";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  respondToPhotoRequest: async (requestId: string, status: "accepted" | "rejected") => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/photos/requests/${requestId}/respond`, { status });
      set((state) => ({
        receivedRequests: state.receivedRequests.map((req) =>
          req._id === requestId ? { ...req, status: response.data.request.status } : req
        ),
        isLoading: false,
      }));
      toast.success(`Request ${status}!`);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to respond to request";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  fetchUserProfileWithPhotos: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/users/profile/${userId}`);
      set({ isLoading: false });
      return response.data; // Return the profile data
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch user profile with photos";
      set({ error: message, isLoading: false });
      toast.error(message);
      return null;
    }
  },
}));
