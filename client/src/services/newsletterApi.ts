import { http } from './api';

// الاشتراك في النشرة البريدية
export const subscribeToNewsletter = async (data: {
  email: string;
  first_name?: string;
  last_name?: string;
}) => {
  try {
    const response = await http.post('/newsletter/subscribe', data);
    return response.data;
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    throw error;
  }
};

// إلغاء الاشتراك من النشرة البريدية
export const unsubscribeFromNewsletter = async (data: { email: string }) => {
  try {
    const response = await http.post('/newsletter/unsubscribe', data);
    return response.data;
  } catch (error) {
    console.error('Newsletter unsubscribe failed:', error);
    throw error;
  }
};

// جلب قائمة المشتركين (للمديرين فقط)
export const getNewsletterSubscribers = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  try {
    const response = await http.get('/newsletter/subscribers', { params });
    return response.data;
  } catch (error) {
    console.error('Get newsletter subscribers failed:', error);
    throw error;
  }
};