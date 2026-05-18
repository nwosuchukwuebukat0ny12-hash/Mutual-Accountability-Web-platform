import { create } from "zustand";
import axiosInstance from "../lib/axios";

const INITIAL_MOCK_FEED = [
  {
    id: "f1",
    checkInId: "66e608a2-mock-1",
    partnerName: "Sarah Connor",
    action: "completed a check-in",
    goalTitle: "Conditioning Loop",
    timestamp: "10m ago",
    note: "Did 10 miles in the rain. Stake verified.",
    approved: false
  },
  {
    id: "f2",
    partnerName: "Sarah Connor",
    action: "unlocked a new badge",
    badgeName: "14-Day Vanguard",
    timestamp: "2h ago",
    isBadge: true
  }
];

export const usePartnershipStore = create((set) => ({
  feed: INITIAL_MOCK_FEED,
  partner: {
    name: "Sarah Connor",
    username: "sarah_c",
    avatar: "",
    streak: 12,
    mutualGoal: "Hypertrophy Conditioning"
  },
  isLoading: false,

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
