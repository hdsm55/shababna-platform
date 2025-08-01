import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create axios instance with default config
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// إضافة Interceptor لإرسال التوكن تلقائياً
http.interceptors.request.use((config) => {
  // الحصول على التوكن من auth store
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 إرسال token:', token.substring(0, 20) + '...');
  } else {
    console.log('⚠️  لا يوجد token');
  }
  return config;
});

// Response interceptor to handle common errors
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginApi = async (email: string, password: string) => {
  console.log('🔍 API: إرسال طلب تسجيل الدخول إلى:', `${http.defaults.baseURL}/auth/login`);
  console.log('🔍 API: البيانات المرسلة:', { email, password: '***' });
  const res = await http.post('/auth/login', { email, password });
  console.log('🔍 API: استجابة الخادم:', res.data);
  return res.data;
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