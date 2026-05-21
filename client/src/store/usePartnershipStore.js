import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const usePartnershipStore = create((set) => ({
  feed: [],
  partnerships: [],
  activePartners: [],
  searchResults: [],
  partner: null,
  activePartnershipData: null,
  isLoading: false,

  fetchActivePartnership: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/partnerships/active");
      const partnersList = res.data.data || res.data;
      set({ 
        activePartners: Array.isArray(partnersList) ? partnersList : [],
        activePartnershipData: partnersList,
        partner: Array.isArray(partnersList) ? partnersList[0] : partnersList
      });
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
      const res = await axiosInstance.get("/checkins/feed");
      const feedItems = res.data.data || res.data || [];
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

  fetchPartnerships: async () => {
    try {
      const res = await axiosInstance.get("/partnerships/pending");
      const list = res.data.data || res.data;
      set({ partnerships: Array.isArray(list) ? list : [] });
      return { success: true };
    } catch (error) {
      console.error("Error in fetchPartnerships:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    }
  },

  respondToInvite: async (inviteId, action) => {
    try {
      const res = await axiosInstance.post("/partnerships/respond", {
        partnershipId: inviteId,
        action
      });
      const updated = res.data.data || res.data;
      set((state) => ({
        partnerships: state.partnerships.map((p) =>
          p._id === inviteId ? updated : p
        )
      }));
      return { success: true };
    } catch (error) {
      console.error("Error in respondToInvite:", error);
      return { success: false, message: error.response?.data?.message || "Failed to respond to invite" };
    }
  },

  searchUser: async (username) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/partnerships/search?username=${username}`);
      const partnerData = res.data.data || res.data;
      return { success: true, user: partnerData };
    } catch (error) {
      console.error("Error in searchUser:", error);
      return { success: false, message: error.response?.data?.message || "User not found. Try searching 'sarah', 'fawaz', 'nabila', or 'mufeeda'." };
    } finally {
      set({ isLoading: false });
    }
  },

  sendInvite: async (username, goalId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/partnerships/invite", { username, goalId });
      return { success: true, data: res.data.data };
    } catch (error) {
      console.error("Error in sendInvite:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred while sending the invitation" };
    } finally {
      set({ isLoading: false });
    }
  },

  approveCheckin: async (feedId, checkInId) => {
    try {
      if (checkInId && !checkInId.includes("mock")) {
        await axiosInstance.post(`/checkins/approve/${checkInId}`);
      }
      
      set((state) => ({
        feed: state.feed.map((item) =>
          item.id === feedId ? { ...item, approved: true } : item
        )
      }));
      return { success: true };
    } catch (error) {
      console.error("Error in approveCheckin:", error);
      return { success: false, message: error.response?.data?.message || "Failed to approve check-in" };
    }
  },

  sendReaction: async (checkInId, reactionType) => {
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
      await axiosInstance.post(`/feed/${checkInId}/reactions`, { type: reactionType });
      return { success: true };
    } catch (error) {
      console.error("Error sending reaction:", error);
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

  dissolvePartnership: async (partnershipId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/partnerships/${partnershipId}`);
      // Refresh active partnerships list
      const res = await axiosInstance.get("/partnerships/active");
      const partnersList = res.data.data || res.data;
      set({ 
        activePartners: Array.isArray(partnersList) ? partnersList : [],
        activePartnershipData: partnersList,
        partner: Array.isArray(partnersList) ? partnersList[0] : partnersList
      });
      return { success: true };
    } catch (error) {
      console.error("Error dissolving partnership:", error);
      return { success: false, message: error.response?.data?.message || "Failed to dissolve partnership" };
    } finally {
      set({ isLoading: false });
    }
  },
}));
