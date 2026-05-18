import { create } from "zustand";

const INITIAL_MOCK_FEED = [
  {
    id: "f1",
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

export const usePartnershipStore = create((set, get) => ({
  feed: INITIAL_MOCK_FEED,
  isLoading: false,
  partner: {
    name: "Sarah Connor",
    username: "sarah_c",
    avatar: "",
    streak: 12,
    mutualGoal: "Hypertrophy Conditioning"
  },

  approveCheckin: async (feedId) => {
    set((state) => ({
      feed: state.feed.map((item) =>
        item.id === feedId ? { ...item, approved: true } : item
      )
    }));
    return { success: true };
  },

  searchUser: async (username) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ isLoading: false });

    const normalized = username.toLowerCase().trim();
    
    // Mock user matching logic
    if (normalized === "sarah" || normalized === "sarah_c") {
      return {
        success: true,
        user: {
          _id: "u_sarah",
          name: "Sarah Connor",
          username: "sarah_c",
          bio: "Building strength, stamina, and preparing for the future.",
          avatar: "",
          mutualCompatibility: 94,
          focusCategories: ["fitness", "habit"]
        }
      };
    } else if (normalized === "fawaz" || normalized === "fawaz007") {
      return {
        success: true,
        user: {
          _id: "u_fawaz",
          name: "Fawaz Lead",
          username: "fawaz007",
          bio: "Full stack builder, database lover, running daily checks.",
          avatar: "",
          mutualCompatibility: 88,
          focusCategories: ["study", "career"]
        }
      };
    } else if (normalized === "nabila" || normalized === "nab_dev") {
      return {
        success: true,
        user: {
          _id: "u_nabila",
          name: "Nabila Schema",
          username: "nab_dev",
          bio: "Data integrity and Zod models. Keeping it structured.",
          avatar: "",
          mutualCompatibility: 91,
          focusCategories: ["study", "other"]
        }
      };
    } else if (normalized === "mufeeda" || normalized === "muf_setup") {
      return {
        success: true,
        user: {
          _id: "u_mufeeda",
          name: "Mufeeda Setup",
          username: "muf_setup",
          bio: "Zustand coordinator and Axios router. Linking the wires.",
          avatar: "",
          mutualCompatibility: 89,
          focusCategories: ["study", "career"]
        }
      };
    }

    return { success: false, message: "User not found. Try searching 'sarah', 'fawaz', 'nabila', or 'mufeeda'." };
  },

  sendInvite: async (recipientId) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ isLoading: false });
    return { success: true, message: "Accountability invitation sent successfully!" };
  }
}));
