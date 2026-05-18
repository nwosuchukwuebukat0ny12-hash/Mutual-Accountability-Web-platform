import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const useGoalStore = create((set) => ({
  goals: [],
  isLoading: false,

  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/goals");
      // Fawaz's controllers usually return data nested in a "data" property (e.g., { success: true, data: [...] })
      const goalsList = res.data.data || res.data;
      set({ goals: Array.isArray(goalsList) ? goalsList : [] });
      return { success: true };
    } catch (error) {
      console.error("Error in fetchGoals:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred while fetching goals" };
    } finally {
      set({ isLoading: false });
    }
  },

  createGoal: async (goalData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/goals", goalData);
      const newGoal = res.data.data || res.data;
      set((state) => ({ goals: [...state.goals, newGoal] }));
      return { success: true, data: newGoal };
    } catch (error) {
      console.error("Error in createGoal:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred while creating the goal" };
    } finally {
      set({ isLoading: false });
    }
  },

  toggleMilestone: async (goalId, milestoneId) => {
    try {
      // Direct call to PATCH /api/goals/:goalId/milestones/:milestoneId
      const res = await axiosInstance.patch(`/goals/${goalId}/milestones/${milestoneId}`);
      const updatedGoal = res.data.data || res.data;
      
      set((state) => ({
        goals: state.goals.map((g) => (g._id === goalId ? updatedGoal : g)),
      }));
      return { success: true, data: updatedGoal };
    } catch (error) {
      console.error("Error in toggleMilestone:", error);
      return { success: false, message: error.response?.data?.message || "An error occurred while toggling the milestone" };
    }
  },
}));
