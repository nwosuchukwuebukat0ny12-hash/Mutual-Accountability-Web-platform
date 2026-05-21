import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const usePartnershipStore = create((set) => ({
  partnerships: [],
  activePartners: [],
  feed: [],
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

  fetchActivePartnership: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/partnerships/active");
      const partnersList = res.data.data || res.data;
      set({ activePartners: Array.isArray(partnersList) ? partnersList : [] });
      return { success: true };
    } catch (error) {
      console.error("Error fetching active partnerships:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeed: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/feed");
      const feedItems = res.data.data || res.data;
      const processedFeed = Array.isArray(feedItems) ? feedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      set({ feed: processedFeed });
      return { success: true };
    } catch (error) {
      console.error("Error fetching feed:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    } finally {
      set({ isLoading: false });
    }
  },

  sendReaction: async (checkInId, reactionType) => {
    // Optimistic UI update
    set((state) => ({
      feed: state.feed.map((item) => {
        if (item._id === checkInId) {
          const currentCount = item.reactions?.[reactionType] || 0;
          return {
            ...item,
            reactions: {
              ...item.reactions,
              [reactionType]: currentCount + 1,
            },
          };
        }
        return item;
      }),
    }));

    try {
      // Network Request
      await axiosInstance.post(`/feed/${checkInId}/reactions`, { type: reactionType });
      return { success: true };
    } catch (error) {
      console.error("Error sending reaction:", error);
      // Rollback on failure
      set((state) => ({
        feed: state.feed.map((item) => {
          if (item._id === checkInId) {
            const currentCount = item.reactions?.[reactionType] || 0;
            return {
              ...item,
              reactions: {
                ...item.reactions,
                [reactionType]: Math.max(0, currentCount - 1),
              },
            };
          }
          return item;
        }),
      }));
      return { success: false, message: error.response?.data?.message || "Failed to send reaction" };
    }
  },
}));
