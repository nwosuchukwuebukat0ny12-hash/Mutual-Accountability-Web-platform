import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const usePartnershipStore = create((set) => ({
  feed: [],
  partnerships: [],
  partner: null,
  activePartners: [],
  activePartnershipData: null,
  isLoading: false,

  // Fetch the currently active partnership and partner details
  fetchActivePartnership: async () => {
    try {
      const res = await axiosInstance.get("/partnerships/active");
      const data = res.data.data;
      if (data) {
        if (Array.isArray(data)) {
          set({
            activePartners: data.map((p) => p.partner || (p.recipient?._id ? p.recipient : p.requester)),
            activePartnershipData: data,
            partner: data[0]?.partner || null
          });
        } else {
          set({ 
            activePartners: data.partner ? [data.partner] : [],
            activePartnershipData: data,
            partner: data.partner 
          });
        }
      } else {
        set({ activePartners: [], activePartnershipData: null, partner: null });
      }
      return { success: true };
    } catch (error) {
      console.error("Error fetching active partnership:", error);
      return { success: false };
    }
  },

  // Fetch the check-in feed for the active partnership
  fetchFeed: async () => {
    try {
      const res = await axiosInstance.get("/checkins/feed");
      const feedItems = res.data.data || [];
      set({ feed: feedItems });
      return { success: true };
    } catch (error) {
      console.error("Error fetching feed:", error);
      return { success: false };
    }
  },

  // Fetch all partnerships for the logged-in user
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

  // Respond to a partnership invite (accept or reject)
  respondToInvite: async (inviteId, action) => {
    try {
      const res = await axiosInstance.post("/partnerships/respond", {
        partnershipId: inviteId,
        action // 'accept' or 'reject'
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

  // Search Accountability Peer matching Fawaz's partner controller
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

  // Send invitation matching Fawaz's { username, goalId } payload
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

  // Verify and approve partner's check-in
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
  }
}));
