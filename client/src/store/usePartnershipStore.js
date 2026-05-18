import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const usePartnershipStore = create((set) => ({
  partnerships: [],
  searchResults: [],
  isLoading: false,

  fetchPartnerships: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/partnerships");
      const list = res.data.data || res.data;
      set({ partnerships: Array.isArray(list) ? list : [] });
      return { success: true };
    } catch (error) {
      console.error("Error in fetchPartnerships:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred while fetching partnerships" };
    } finally {
      set({ isLoading: false });
    }
  },

  searchUser: async (username) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/users/search?username=${username}`);
      const results = res.data.data || res.data;
      set({ searchResults: Array.isArray(results) ? results : [] });
      return { success: true, data: results };
    } catch (error) {
      console.error("Error in searchUser:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred during user search" };
    } finally {
      set({ isLoading: false });
    }
  },

  sendInvite: async (userId, goalId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/partnerships", { recipientId: userId, goalId });
      const newPartnership = res.data.data || res.data;
      set((state) => ({
        partnerships: [...state.partnerships, newPartnership],
      }));
      return { success: true, data: newPartnership };
    } catch (error) {
      console.error("Error in sendInvite:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred while sending the invitation" };
    } finally {
      set({ isLoading: false });
    }
  },

  respondToInvite: async (inviteId, status) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/partnerships/${inviteId}`, { status });
      const updatedPartnership = res.data.data || res.data;
      
      set((state) => ({
        partnerships: state.partnerships.map((p) => (p._id === inviteId ? updatedPartnership : p)),
      }));
      return { success: true, data: updatedPartnership };
    } catch (error) {
      console.error("Error in respondToInvite:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred while responding to the invitation" };
    } finally {
      set({ isLoading: false });
    }
  },
}));
