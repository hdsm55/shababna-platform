import axios from 'axios';

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create axios instance with optimized config
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  timeout: 8000, // Reduced timeout for faster failure detection
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache interceptor
const cacheInterceptor = (config: any) => {
  if (config.method === 'get' && !config.noCache) {
    const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return Promise.resolve(cached.data);
    }
  }
  return config;
};

// Response cache interceptor
const responseCacheInterceptor = (response: any) => {
  if (response.config.method === 'get' && !response.config.noCache) {
    const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    });
  }
  return response;
};

// إضافة Interceptor لإرسال التوكن تلقائياً
http.interceptors.request.use((config) => {
  // الحصول على التوكن من localStorage
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Apply cache interceptor
  return cacheInterceptor(config);
});

// Response interceptor to handle common errors and caching
http.interceptors.response.use(
  (response) => {
    // Apply response cache interceptor
    return responseCacheInterceptor(response);
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Clear cache function
export const clearCache = () => {
  cache.clear();
};

// Clear specific cache entry
export const clearCacheEntry = (url: string, params?: any) => {
  const cacheKey = `${url}${JSON.stringify(params || {})}`;
  cache.delete(cacheKey);
};

export const loginApi = async (email: string, password: string) => {
  const { data } = await http.post('/auth/login', { email, password });
  return data;
};

export const registerApi = async (data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}) => {
  const res = await http.post('/auth/register', data);
  return res.data;
};

export default http;