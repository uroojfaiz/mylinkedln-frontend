import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Attach token from localStorage as a fallback (some browsers block third-party cookies)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kaarwan_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
