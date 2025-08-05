import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { getApiUrl } from '../config/environment';

// Create axios instance with default config
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || getApiUrl(),
  withCredentials: false, // Changed to false to fix CORS issue
  timeout: 45000, // 45 seconds timeout for Render free plan
});

// إضافة Interceptor لإرسال التوكن تلقائياً
http.interceptors.request.use((config) => {
  // الحصول على التوكن من auth store
  const token = useAuthStore.getState().token;

  if (token) {
    if (!config.headers) {
      config.headers = {} as any;
    }
    config.headers.Authorization = `Bearer ${token}`;
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

    // Handle network errors
    if (!error.response) {
      console.log('🌐 Network error - backend might be idle');
      return Promise.reject({
        ...error,
        isBackendIdle: true,
        message: 'خطأ في الاتصال - الخادم يستيقظ...'
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

// Enhanced API functions with retry logic
export const loginApi = async (email: string, password: string) => {
  console.log('🔍 API: إرسال طلب تسجيل الدخول إلى:', `${http.defaults.baseURL}/auth/login`);
  console.log('🔍 API: البيانات المرسلة:', { email, password: '***' });

  try {
    const res = await http.post('/auth/login', { email, password });
    console.log('🔍 API: استجابة الخادم:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ Login API Error:', error);
    throw error;
  }
};

export const registerApi = async (data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}) => {
  try {
    const res = await http.post('/auth/register', data);
    return res.data;
  } catch (error: any) {
    console.error('❌ Register API Error:', error);
    throw error;
  }
};

// Enhanced retry wrapper for API calls
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 2000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;

      // Don't retry for client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }

      // Don't retry for authentication errors
      if (error.response?.status === 401) {
        throw error;
      }

      console.log(`🔄 Retry attempt ${attempt}/${maxRetries} failed:`, error.message);

      if (attempt < maxRetries) {
        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
};

export default http;