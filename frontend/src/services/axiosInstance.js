import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);