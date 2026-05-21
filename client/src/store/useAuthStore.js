import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.data.user });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.data.user });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.data.user });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      console.log("Error in logout:", error);
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updateProfileSettings: async (data) => {
    try {
      // In a real scenario, this would call: await axiosInstance.put("/auth/profile", data);
      // For now, we optimistically update the local state so the UI reflects changes instantly
      set((state) => ({
        authUser: {
          ...state.authUser,
          ...data,
        }
      }));
      return { success: true };
    } catch (error) {
      console.log("Error in updateProfileSettings:", error);
      return { success: false, message: "Failed to update profile settings" };
    }
  },
}));
