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