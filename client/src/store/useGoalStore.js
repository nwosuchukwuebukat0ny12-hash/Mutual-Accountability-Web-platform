import { create } from "zustand";

const INITIAL_MOCK_GOALS = [
  {
    _id: "g1",
    title: "Leetspeak Mastery (100 Problems)",
    description: "Daily competitive programming challenge to sharpen dynamic programming and recursion algorithms.",
    category: "study",
    deadline: "2026-06-30",
    frequency: "daily",
    progress: 75,
    milestones: [
      { title: "Solve first 25 easy problems", completed: true },
      { title: "Finish 50 medium recursion problems", completed: true },
      { title: "Complete 25 hard dynamic programming problems", completed: false }
    ],
    status: "active"
  },
  {
    _id: "g2",
    title: "Hypertrophy Conditioning",
    description: "High-intensity athletic conditioning split with focused progression tracks.",
    category: "fitness",
    deadline: "2026-07-15",
    frequency: "every2days",
    progress: 50,
    milestones: [
      { title: "Run 5k under 22 mins", completed: true },
      { title: "4 strength cycles completed", completed: false }
    ],
    status: "active"
  }
];

export const useGoalStore = create((set, get) => ({
  goals: INITIAL_MOCK_GOALS,
  isLoading: false,

  fetchGoals: async () => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ isLoading: false });
  },

  createGoal: async (goalData) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const newGoal = {
      _id: `g_${Date.now()}`,
      title: goalData.title,
      description: goalData.description || "",
      category: goalData.category || "other",
      deadline: goalData.deadline || new Date().toISOString().split("T")[0],
      frequency: goalData.frequency || "daily",
      progress: 0,
      milestones: (goalData.milestones || []).map((m) => ({
        title: typeof m === "string" ? m : m.title,
        completed: false
      })),
      status: "active"
    };

    set((state) => ({
      goals: [...state.goals, newGoal],
      isLoading: false
    }));

    return { success: true };
  },

  toggleMilestone: async (goalId, milestoneIndex) => {
    set((state) => {
      const updatedGoals = state.goals.map((goal) => {
        if (goal._id === goalId) {
          const updatedMilestones = [...goal.milestones];
          updatedMilestones[milestoneIndex] = {
            ...updatedMilestones[milestoneIndex],
            completed: !updatedMilestones[milestoneIndex].completed
          };

          // Re-calculate progress percentage
          const completedCount = updatedMilestones.filter((m) => m.completed).length;
          const progress = updatedMilestones.length > 0 
            ? Math.round((completedCount / updatedMilestones.length) * 100) 
            : 0;

          return {
            ...goal,
            milestones: updatedMilestones,
            progress
          };
        }
        return goal;
      });

      return { goals: updatedGoals };
    });

    return { success: true };
  }
}));
