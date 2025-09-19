// Environment Configuration
export const getApiUrl = () => {
  // في البيئة المحلية
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  // في البيئة الإنتاجية
  return 'https://shababna-backend.onrender.com/api';
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