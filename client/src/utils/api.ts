// API Base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Auth Token Management
const AUTH_TOKEN_KEY = 'shababna_auth_token';

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// API Request Helper
interface RequestConfig extends RequestInit {
  token?: string;
}

export const fetchAPI = async (endpoint: string, config: RequestConfig = {}) => {
  const { token, ...rest } = config;

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...rest.headers,
  });

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Date Formatting
export const formatDate = (date: string | Date, locale = 'ar-SA') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Time Formatting
export const formatTime = (date: string | Date, locale = 'ar-SA') => {
  return new Date(date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Form Error Helper
export const getFormError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'حدث خطأ غير متوقع';
};

// Image URL Helper
export const getImageURL = (path: string) => {
  if (path.startsWith('http')) {
    return path;
  }
  return `${API_URL}/uploads/${path}`;
};
