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
  publicFeed: [],
  leaderboard: [],

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

  fetchPublicFeed: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/checkins/public");
      const feedItems = res.data.data || res.data || [];
      const processedFeed = Array.isArray(feedItems) ? feedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      set({ publicFeed: processedFeed });
      return { success: true };
    } catch (error) {
      console.error("Error fetching public feed:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLeaderboard: async () => {
    try {
      const res = await axiosInstance.get("/users/leaderboard");
      const list = res.data.data || res.data || [];
      set({ leaderboard: Array.isArray(list) ? list : [] });
      return { success: true };
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
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
      const results = partnerData ? [partnerData] : [];
      set({ searchResults: results });
      return { success: true, user: partnerData };
    } catch (error) {
      console.error("Error in searchUser:", error);
      set({ searchResults: [] });
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

  sendNudge: async (recipientId) => {
    try {
      await axiosInstance.post("/notifications/nudge", { recipientId });
      return { success: true };
    } catch (error) {
      console.error("Error sending nudge:", error);
      return { success: false, message: error.response?.data?.message || "Failed to send nudge" };
    }
  },

  sendReaction: async (checkInId, reactionType) => {
    set((state) => ({
      feed: state.feed.map((item) => {
        if (item.id === checkInId || item.checkInId === checkInId) {
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
      await axiosInstance.post(`/checkins/${checkInId}/reactions`, { type: reactionType });
      return { success: true };
    } catch (error) {
      console.error("Error sending reaction:", error);
      // Revert optimistic update
      set((state) => ({
        feed: state.feed.map((item) => {
          if (item.id === checkInId || item.checkInId === checkInId) {
            const currentCount = item.reactions?.[reactionType] || 1;
            return {
              ...item,
              reactions: {
                ...item.reactions,
                [reactionType]: currentCount - 1,
              },
            };
          }
          return item;
        }),
      }));
      return { success: false, message: "Failed to send reaction" };
    }
  },

  addComment: async (checkInId, text) => {
    try {
      const res = await axiosInstance.post(`/checkins/${checkInId}/comments`, { text });
      const updatedComments = res.data.data;
      
      set((state) => ({
        feed: state.feed.map((item) => {
          // Note: checkIn feed maps _id to id or checkInId sometimes, handle both
          if (item.id === checkInId || item.checkInId === checkInId || item._id === checkInId) {
            return {
              ...item,
              comments: updatedComments
            };
          }
          return item;
        })
      }));
      return { success: true };
    } catch (error) {
      console.error("Error adding comment:", error);
      return { success: false, message: "Failed to add comment" };
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
