import http from './api';

// أنواع البيانات للنماذج
export interface ContactFormData {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface JoinUsFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  age: number;
  interests: string[];
  motivation: string;
}

export interface NewsletterFormData {
  email: string;
  first_name?: string;
  last_name?: string;
}

// إرسال نموذج الاتصال
export const submitContactForm = async (data: ContactFormData) => {
  const response = await http.post('/forms/contact', data);
  return response.data;
};

// إرسال نموذج الانضمام
export const submitJoinUsForm = async (data: JoinUsFormData) => {
  const response = await http.post('/forms/join-us', data);
  return response.data;
};

// الاشتراك في النشرة الإخبارية
export const subscribeToNewsletter = async (data: NewsletterFormData) => {
  const response = await http.post('/forms/newsletter', data);
  return response.data;
};

// إلغاء الاشتراك من النشرة الإخبارية
export const unsubscribeFromNewsletter = async (email: string) => {
  const response = await http.post('/forms/newsletter/unsubscribe', { email });
  return response.data;
};