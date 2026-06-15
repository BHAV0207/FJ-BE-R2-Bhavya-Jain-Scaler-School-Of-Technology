import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; 

const api = axios.create({
  baseURL: `${BASE}/api/v1`,
});

// The dashboard route is mounted at /dashboard (not /api/v1/dashboard)
export const dashboardApi = axios.create({
  baseURL: BASE,
});

const attachToken = (config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

dashboardApi.interceptors.request.use(attachToken);
api.interceptors.request.use(attachToken);

const handle401 = (error: any) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

api.interceptors.response.use((r) => r, handle401);
dashboardApi.interceptors.response.use((r) => r, handle401);

export default api;
