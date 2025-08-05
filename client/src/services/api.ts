import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create axios instance with default config
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout for Render free plan
});

// إضافة Interceptor لإرسال التوكن تلقائياً
http.interceptors.request.use((config) => {
  // الحصول على التوكن من auth store
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
    console.log('🔑 إرسال token:', token.substring(0, 20) + '...');
  } else {
    console.log('⚠️  لا يوجد token');
  }

  console.log('🌐 API Request URL:', config.baseURL + config.url);
  console.log('🌐 API Request Method:', config.method?.toUpperCase());

  return config;
});

// Response interceptor to handle common errors
http.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    console.error('❌ API Error Response:', error.response?.data);
    console.error('❌ API Error Status:', error.response?.status);

    // Handle backend idle time gracefully
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.log('⏰ Backend is waking up, please wait...');
      // Don't redirect to login for timeout errors
      return Promise.reject({
        ...error,
        isBackendIdle: true,
        message: 'الخادم يستيقظ، يرجى الانتظار...'
      });
    }

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