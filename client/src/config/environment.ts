// Environment Configuration
export const getApiUrl = () => {
  // في البيئة المحلية
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
  }
  // في البيئة الإنتاجية - استخدام VITE_API_URL أولاً ثم fallback
  return import.meta.env.VITE_API_URL || import.meta.env.VITE_PRODUCTION_API_URL || 'https://shababna-platform.onrender.com/api';
};

export const getEnvironment = () => {
  return import.meta.env.DEV ? 'development' : 'production';
};

export const isDevelopment = () => {
  return import.meta.env.DEV;
};

export const isProduction = () => {
  return !import.meta.env.DEV;
};