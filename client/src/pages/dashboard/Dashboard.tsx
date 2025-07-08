import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getRecentActivities,
} from '../../services/dashboardApi';
import { Link } from 'react-router-dom';
import {
  AccessibleSection,
  SkipToContent,
} from '../../components/common/AccessibleComponents';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import QuickActions from '../../components/common/QuickActions';

const DashboardOverview: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // جلب إحصائيات الداشبورد
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000,
  });

  // جلب الأنشطة الحديثة
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: getRecentActivities,
    staleTime: 5 * 60 * 1000,
  });

  // بيانات افتراضية للإحصائيات
  const mockStats = [
    {
      title: 'إجمالي الفعاليات',
      value: 24,
      change: '+12%',
      changeType: 'increase',
      icon: Calendar,
      color: 'primary',
    },
    {
      title: 'البرامج النشطة',
      value: 8,
      change: '+3%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'success',
    },
    {
      title: 'إجمالي الأعضاء',
      value: 156,
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'info',
    },
    {
      title: 'إجمالي التبرعات',
      value: '$12,450',
      change: '+15%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'warning',
    },
  ];

  // بيانات افتراضية للأنشطة
  const mockActivities = [
    {
      id: 1,
      type: 'event',
      message: 'تم إضافة فعالية جديدة: ورشة عمل الشباب',
      date: 'منذ ساعتين',
      status: 'completed',
      icon: CheckCircle,
    },
    {
      id: 2,
      type: 'donation',
      message: 'تم استلام تبرع جديد بقيمة $500',
      date: 'منذ 3 ساعات',
      status: 'completed',
      icon: CheckCircle,
    },
    {
      id: 3,
      type: 'program',
      message: 'تم تحديث برنامج التوعية الصحية',
      date: 'منذ 5 ساعات',
      status: 'pending',
      icon: Clock,
    },
    {
      id: 4,
      type: 'user',
      message: 'انضم 3 أعضاء جدد للمنظمة',
      date: 'منذ يوم واحد',
      status: 'completed',
      icon: CheckCircle,
    },
    {
      id: 5,
      type: 'alert',
      message: 'فعالية "ملتقى الشباب" تحتاج إلى تحديث',
      date: 'منذ يومين',
      status: 'warning',
      icon: AlertCircle,
    },
  ];

  // بيانات افتراضية للرسوم البيانية
  const mockChartData = {
    donations: [1200, 1800, 1500, 2200, 1900, 2400, 2100],
    events: [3, 5, 2, 7, 4, 6, 3],
    members: [140, 145, 148, 152, 155, 158, 156],
  };

  const stats =
    statsData?.data &&
    Array.isArray(statsData.data) &&
    statsData.data.length > 0
      ? statsData.data.map((stat: any) => ({
          ...stat,
          change: stat.change || '+0%',
          changeType: stat.changeType || 'increase',
        }))
      : mockStats;

  let recentActivities = mockActivities;
  if (
    activitiesData &&
    activitiesData.data &&
    Array.isArray(activitiesData.data) &&
    activitiesData.data.length > 0
  ) {
    recentActivities = activitiesData.data;
  }

  const quickActions = [
    {
      to: '/dashboard/events/new',
      label: 'إضافة فعالية',
      icon: Plus,
      color: 'primary' as const,
      description: 'إنشاء فعالية جديدة',
    },
    {
      to: '/dashboard/programs/new',
      label: 'إضافة برنامج',
      icon: TrendingUp,
      color: 'success' as const,
      description: 'إنشاء برنامج جديد',
    },
    {
      to: '/dashboard/donations/new',
      label: 'تسجيل تبرع',
      icon: DollarSign,
      color: 'warning' as const,
      description: 'تسجيل تبرع جديد',
    },
    {
      to: '/dashboard/users/new',
      label: 'إضافة عضو',
      icon: Users,
      color: 'info' as const,
      description: 'إضافة عضو جديد',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'warning':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'warning':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  // دالة التعامل مع الأزرار غير الفعالة
  const handleUnavailable = (msg = 'هذه الخاصية قيد التطوير، قريبًا!') => {
    setModalMsg(msg);
    setModalOpen(true);
  };

  if (statsError || activitiesError) {
    return (
      <DashboardLayout>
        <SkipToContent />
        <AccessibleSection>
          <Alert type="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى.
          </Alert>
        </AccessibleSection>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-2 md:px-6 py-8">
        {/* Quick Actions */}
        <AccessibleSection>
          <Card className="mb-10 shadow-lg rounded-2xl p-6 bg-gradient-to-tr from-blue-50 to-white border-0">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 tracking-tight text-center md:text-right">
              إجراءات سريعة
            </h2>
            <QuickActions actions={quickActions} className="mb-0" />
          </Card>
        </AccessibleSection>

        {/* Stats & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Stats */}
          <AccessibleSection>
            <Card className="mb-8 shadow-md rounded-2xl p-6 bg-white border-0">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6 text-center md:text-right">
                إحصائيات سريعة
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-blue-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="w-6 h-6 text-blue-600"
                      aria-hidden="true"
                    />
                    <span className="text-base font-semibold text-gray-900">
                      الفعاليات هذا الشهر
                    </span>
                  </div>
                  <span className="text-xl font-bold text-blue-700">12</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Users
                      className="w-6 h-6 text-green-600"
                      aria-hidden="true"
                    />
                    <span className="text-base font-semibold text-gray-900">
                      الأعضاء الجدد
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-700">8</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign
                      className="w-6 h-6 text-yellow-600"
                      aria-hidden="true"
                    />
                    <span className="text-base font-semibold text-gray-900">
                      التبرعات هذا الشهر
                    </span>
                  </div>
                  <span className="text-xl font-bold text-yellow-700">
                    $2,450
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className="w-6 h-6 text-purple-600"
                      aria-hidden="true"
                    />
                    <span className="text-base font-semibold text-gray-900">
                      البرامج النشطة
                    </span>
                  </div>
                  <span className="text-xl font-bold text-purple-700">6</span>
                </div>
              </div>
            </Card>
          </AccessibleSection>

          {/* Recent Activities */}
          <AccessibleSection>
            <Card className="mb-8 shadow-md rounded-2xl p-6 bg-white border-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  أحدث الأنشطة
                </h2>
                <Button
                  as={Link}
                  to="/dashboard/activities"
                  variant="ghost"
                  size="sm"
                  aria-label="عرض جميع الأنشطة"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  عرض الكل
                </Button>
              </div>
              <div>
                {activitiesLoading ? (
                  <div className="flex justify-center py-6">
                    <LoadingSpinner />
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="text-gray-400 text-center py-6">
                    لا توجد أنشطة حديثة
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.slice(0, 5).map((activity: any) => {
                      const StatusIcon = getStatusIcon(activity.status);
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <div
                            className={`p-2 rounded-full ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            <StatusIcon
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium">
                              {activity.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.date}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </AccessibleSection>
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="تنبيه">
        <div className="text-center py-4">
          <p className="text-gray-700 text-lg font-medium">{modalMsg}</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardOverview;
