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
  const { data } = await api.get('/dashboard/users');
  return data;
};

// جلب قائمة التبرعات
export const fetchDonations = async () => {
  const { data } = await api.get('/dashboard/donations');
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