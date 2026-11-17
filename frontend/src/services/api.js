import axios from 'axios';

// Base API configuration for Spring Boot backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create Axios client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request interceptor for attaching auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('scholarhub_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.warn(`[API Response Error ${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.info('[API Backend Offline / Fallback Mode]: Spring Boot server not reachable at', API_BASE_URL);
    }
    return Promise.reject(error);
  }
);

// Connected to live Spring Boot backend by default (set VITE_USE_MOCK_STORAGE=true to force offline mode)
export const USE_MOCK_STORAGE = import.meta.env.VITE_USE_MOCK_STORAGE === 'true';

// Helper to check live backend connectivity
export const checkBackendHealth = async () => {
  try {
    const res = await apiClient.get('/auth/health');
    return res.data?.status === 'UP';
  } catch (e) {
    return false;
  }
};

export default apiClient;
