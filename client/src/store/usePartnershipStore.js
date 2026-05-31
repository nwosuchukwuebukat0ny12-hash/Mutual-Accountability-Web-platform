import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const usePartnershipStore = create((set, get) => ({
  feed: [],
  feedHasMore: false,
  feedNextCursor: null,
  feedIsLoadingMore: false,
  partnerships: [],
  activePartners: [],
  searchResults: [],
  partner: null,
  activePartnershipData: null,
  isLoading: false,
  publicFeed: [],
  publicFeedHasMore: false,
  publicFeedNextCursor: null,
  publicFeedIsLoadingMore: false,
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
      const res = await axiosInstance.get("/checkins/feed?limit=6");
      const feedItems = res.data.data || [];
      set({ 
        feed: feedItems, 
        feedHasMore: res.data.hasMore || false,
        feedNextCursor: res.data.nextCursor || null
      });
      return { success: true };
    } catch (error) {
      console.error("Error fetching feed:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMoreFeed: async () => {
    const { feedNextCursor, feedHasMore, feedIsLoadingMore, feed } = get();
    if (!feedHasMore || feedIsLoadingMore || !feedNextCursor) return { success: true };

    set({ feedIsLoadingMore: true });
    try {
      const res = await axiosInstance.get(`/checkins/feed?cursor=${feedNextCursor}&limit=6`);
      const newItems = res.data.data || [];
      
      const mergedMap = new Map();
      feed.forEach(item => {
        const id = item.id || item._id || item.checkInId;
        if (id) {
          mergedMap.set(id, item);
        } else {
          mergedMap.set(item, item);
        }
      });

      newItems.forEach(item => {
        const id = item.id || item._id || item.checkInId;
        if (id) {
          const existing = mergedMap.get(id);
          mergedMap.set(id, existing ? { ...existing, ...item } : item);
        } else {
          mergedMap.set(item, item);
        }
      });

      set({
        feed: Array.from(mergedMap.values()),
        feedHasMore: res.data.hasMore || false,
        feedNextCursor: res.data.nextCursor || null
      });
      return { success: true };
    } catch (error) {
      console.error("Error fetching more feed:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    } finally {
      set({ feedIsLoadingMore: false });
    }
  },

  fetchPublicFeed: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/checkins/public?limit=6");
      const feedItems = res.data.data || [];
      set({ 
        publicFeed: feedItems, 
        publicFeedHasMore: res.data.hasMore || false,
        publicFeedNextCursor: res.data.nextCursor || null
      });
      return { success: true };
    } catch (error) {
      console.error("Error fetching public feed:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMorePublicFeed: async () => {
    const { publicFeedNextCursor, publicFeedHasMore, publicFeedIsLoadingMore, publicFeed } = get();
    if (!publicFeedHasMore || publicFeedIsLoadingMore || !publicFeedNextCursor) return { success: true };

    set({ publicFeedIsLoadingMore: true });
    try {
      const res = await axiosInstance.get(`/checkins/public?cursor=${publicFeedNextCursor}&limit=6`);
      const newItems = res.data.data || [];
      
      const mergedMap = new Map();
      publicFeed.forEach(item => {
        const id = item.id || item._id || item.checkInId;
        if (id) {
          mergedMap.set(id, item);
        } else {
          mergedMap.set(item, item);
        }
      });

      newItems.forEach(item => {
        const id = item.id || item._id || item.checkInId;
        if (id) {
          const existing = mergedMap.get(id);
          mergedMap.set(id, existing ? { ...existing, ...item } : item);
        } else {
          mergedMap.set(item, item);
        }
      });

      set({
        publicFeed: Array.from(mergedMap.values()),
        publicFeedHasMore: res.data.hasMore || false,
        publicFeedNextCursor: res.data.nextCursor || null
      });
      return { success: true };
    } catch (error) {
      console.error("Error fetching more public feed:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    } finally {
      set({ publicFeedIsLoadingMore: false });
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
      if (checkInId) {
        await axiosInstance.post(`/checkins/approve/${checkInId}`);
      }
      
      const matchesId = (item) => {
        return (
          (feedId && (item.id === feedId || item._id === feedId || item.checkInId === feedId)) ||
          (checkInId && (item.id === checkInId || item._id === checkInId || item.checkInId === checkInId))
        );
      };

      set((state) => ({
        feed: state.feed.map((item) =>
          matchesId(item) ? { ...item, approved: true } : item
        ),
        publicFeed: state.publicFeed.map((item) =>
          matchesId(item) ? { ...item, approved: true } : item
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
    const matchesId = (item) => {
      return item.id === checkInId || item._id === checkInId || item.checkInId === checkInId;
    };

    const updateReactions = (feedArray) =>
      feedArray.map((item) => {
        if (matchesId(item)) {
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
      });

    set((state) => ({
      feed: updateReactions(state.feed),
      publicFeed: updateReactions(state.publicFeed),
    }));

    try {
      await axiosInstance.post(`/checkins/${checkInId}/reactions`, { type: reactionType });
      return { success: true };
    } catch (error) {
      console.error("Error sending reaction:", error);
      // Revert optimistic update
      const revertReactions = (feedArray) =>
        feedArray.map((item) => {
          if (matchesId(item)) {
            const currentCount = item.reactions?.[reactionType] || 1;
            return {
              ...item,
              reactions: {
                ...item.reactions,
                [reactionType]: Math.max(0, currentCount - 1),
              },
            };
          }
          return item;
        });

      set((state) => ({
        feed: revertReactions(state.feed),
        publicFeed: revertReactions(state.publicFeed),
      }));
      return { success: false, message: "Failed to send reaction" };
    }
  },

  addComment: async (checkInId, text) => {
    try {
      const res = await axiosInstance.post(`/checkins/${checkInId}/comments`, { text });
      const updatedComments = res.data.data;
      
      const matchesId = (item) => {
        return item.id === checkInId || item._id === checkInId || item.checkInId === checkInId;
      };

      set((state) => ({
        feed: state.feed.map((item) =>
          matchesId(item) ? { ...item, comments: updatedComments } : item
        ),
        publicFeed: state.publicFeed.map((item) =>
          matchesId(item) ? { ...item, comments: updatedComments } : item
        )
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
