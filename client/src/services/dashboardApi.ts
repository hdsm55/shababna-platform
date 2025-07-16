import api from './api';

// جلب إحصائيات الداشبورد (عدد الفعاليات، البرامج، الأعضاء، التبرعات)
export const getDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};

// جلب الأنشطة الحديثة
export const getRecentActivities = async () => {
  const { data } = await api.get('/dashboard/activities');
  return data;
};

// جلب قائمة المستخدمين
export const fetchUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

// جلب قائمة التبرعات
export const fetchDonations = async () => {
  const { data } = await api.get('/donations');
  return data;
};

// جلب بيانات التحليلات
export const fetchAnalytics = async () => {
  const { data } = await api.get('/dashboard/analytics');
  return data;
};

// جلب قائمة المحتوى
export const fetchContent = async () => {
  const { data } = await api.get('/dashboard/content');
  return data;
};

// جلب قائمة التقارير
export const fetchReports = async () => {
  const { data } = await api.get('/dashboard/reports');
  return data;
};

// حذف فعالية
export const deleteEvent = async (id: string) => {
  const { data } = await api.delete(`/dashboard/events/${id}`);
  return data;
};

// حذف برنامج
export const deleteProgram = async (id: string) => {
  const { data } = await api.delete(`/dashboard/programs/${id}`);
  return data;
};

// حذف مستخدم
export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/dashboard/users/${id}`);
  return data;
};

// حذف تبرع
export const deleteDonation = async (id: string) => {
  const { data } = await api.delete(`/dashboard/donations/${id}`);
  return data;
};

// إضافة تبرع جديد
export const createDonation = async (donationData: any) => {
  const { data } = await api.post('/dashboard/donations', donationData);
  return data;
};

// === API Services للجداول الجديدة ===

// جلب رسائل التواصل
export const fetchContactForms = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const { data } = await api.get('/forms/contact-forms', { params });
  return data;
};

// تحديث حالة قراءة رسالة التواصل
export const updateContactFormReadStatus = async (id: string, isRead: boolean) => {
  const { data } = await api.patch(`/forms/contact-forms/${id}/read`, { is_read: isRead });
  return data;
};

// جلب طلبات الانضمام
export const fetchJoinRequests = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const { data } = await api.get('/forms/join-requests', { params });
  return data;
};

// تحديث حالة طلب الانضمام
export const updateJoinRequestStatus = async (id: string, status: string, notes?: string) => {
  const { data } = await api.patch(`/forms/join-requests/${id}/status`, { status, notes });
  return data;
};

// جلب تسجيلات البرامج
export const fetchProgramRegistrations = async (params?: {
  page?: number;
  limit?: number;
  program_id?: string;
}) => {
  const { data } = await api.get('/forms/program-registrations', { params });
  return data;
};

// جلب تسجيلات الفعاليات
export const fetchEventRegistrations = async (params?: {
  page?: number;
  limit?: number;
  event_id?: string;
}) => {
  const { data } = await api.get('/forms/event-registrations', { params });
  return data;
};

// جلب إحصائيات مفصلة
export const fetchDetailedStats = async () => {
  const { data } = await api.get('/dashboard/detailed-stats');
  return data;
};

// جلب تقرير شهري
export const fetchMonthlyReport = async (month?: string, year?: string) => {
  const { data } = await api.get('/dashboard/monthly-report', {
    params: { month, year }
  });
  return data;
};

// تصدير البيانات
export const exportData = async (type: string, format: 'csv' | 'excel' = 'csv') => {
  const { data } = await api.get(`/dashboard/export/${type}`, {
    params: { format },
    responseType: 'blob'
  });
  return data;
};