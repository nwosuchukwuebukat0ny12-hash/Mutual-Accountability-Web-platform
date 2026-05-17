import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});

// Response interceptor to handle global errors (like 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and not already retrying and not a logout request
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/logout") {
      // Import store dynamically to avoid circular dependency
      const { useAuthStore } = await import("../store/useAuthStore");
      useAuthStore.getState().logout();
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
