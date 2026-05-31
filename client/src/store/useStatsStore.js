import { create } from 'zustand';
import axiosInstance from '../lib/axios';

const useStatsStore = create((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchMyStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/users/me/stats');
      set({ stats: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load stats', isLoading: false });
    }
  }
}));

export default useStatsStore;
