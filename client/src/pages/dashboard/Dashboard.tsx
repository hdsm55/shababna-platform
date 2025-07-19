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
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Star,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Bell,
  Settings,
  Download,
  MessageCircle,
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
    refetch: refetchStats,
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
    refetch: refetchActivities,
  } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: getRecentActivities,
    staleTime: 5 * 60 * 1000,
  });

  // بيانات افتراضية للإحصائيات
  const mockStats = {
    overview: [
      {
        title: t('dashboard.stats.events', 'إجمالي الفعاليات'),
        value: 24,
        change: '+12 ' + t('dashboard.stats.active', 'نشط'),
        changeType: 'increase',
        icon: Calendar,
        color: 'primary',
        details: {
          active: 12,
          upcoming: 8,
          completed: 4,
        },
      },
      {
        title: t('dashboard.stats.programs', 'البرامج النشطة'),
        value: 8,
        change: '+3 ' + t('dashboard.stats.active', 'نشط'),
        changeType: 'increase',
        icon: TrendingUp,
        color: 'success',
        details: {
          active: 5,
          total: 8,
        },
      },
      {
        title: t('dashboard.stats.members', 'إجمالي الأعضاء'),
        value: 156,
        change: '+8%',
        changeType: 'increase',
        icon: Users,
        color: 'info',
        details: {
          new: 12,
          total: 156,
        },
      },
    ],
    engagement: [
      {
        title: t('dashboard.stats.programRegistrations', 'تسجيل البرامج'),
        value: 45,
        icon: Users,
        color: 'primary',
      },
      {
        title: t('dashboard.stats.programSupport', 'دعم البرامج'),
        value: 23,
        icon: Heart,
        color: 'success',
      },
      {
        title: t('dashboard.stats.eventRegistrations', 'تسجيل الفعاليات'),
        value: 67,
        icon: Calendar,
        color: 'info',
      },
      {
        title: t('dashboard.stats.contactMessages', 'رسائل التواصل'),
        value: 12,
        icon: MessageCircle,
        color: 'warning',
        alert: '3 ' + t('dashboard.stats.unread', 'غير مقروءة'),
      },
    ],
  };

  // بيانات افتراضية للأنشطة
  const mockActivities = [
    {
      id: 1,
      type: 'event',
      message: 'تم إضافة فعالية جديدة: ورشة عمل الشباب',
      date: 'منذ ساعتين',
      status: 'completed',
      icon: CheckCircle,
      priority: 'high',
      user: 'النظام',
      details: 'فعالية نشطة',
    },
    {
      id: 2,
      type: 'donation',
      message: 'تم استلام تبرع جديد بقيمة $500',
      date: 'منذ 3 ساعات',
      status: 'completed',
      icon: CheckCircle,
      priority: 'medium',
      user: 'أحمد محمد',
      details: 'تبرع نقدي - 500 ريال',
    },
    {
      id: 3,
      type: 'program',
      message: 'تم تحديث برنامج التوعية الصحية',
      date: 'منذ 5 ساعات',
      status: 'pending',
      icon: Clock,
      priority: 'low',
      user: 'النظام',
      details: 'برنامج قيد الانتظار',
    },
    {
      id: 4,
      type: 'user',
      message: 'انضم عضو جديد: سارة أحمد',
      date: 'منذ يوم واحد',
      status: 'completed',
      icon: CheckCircle,
      priority: 'medium',
      user: 'سارة أحمد',
      details: 'البريد الإلكتروني: sara@example.com',
    },
    {
      id: 5,
      type: 'contact',
      message: 'رسالة جديدة من محمد علي: استفسار عن البرامج',
      date: 'منذ يومين',
      status: 'pending',
      icon: MessageCircle,
      priority: 'high',
      user: 'محمد علي',
      details: 'البريد: mohammed@example.com',
    },
  ];

  // بيانات افتراضية للرسوم البيانية
  const mockChartData = {
    donations: [1200, 1800, 1500, 2200, 1900, 2400, 2100],
    events: [3, 5, 2, 7, 4, 6, 3],
    members: [140, 145, 148, 152, 155, 158, 156],
  };

  // استخدام البيانات الحقيقية أو الافتراضية
  const stats = statsData?.data || mockStats;
  const recentActivities = activitiesData?.data || mockActivities;

  const quickActions = [
    {
      to: '/dashboard/events/new',
      label: t('dashboard.actions.addEvent', 'إضافة فعالية'),
      icon: Plus,
      color: 'primary' as const,
      description: t('dashboard.actions.addEventDesc', 'إنشاء فعالية جديدة'),
    },
    {
      to: '/dashboard/programs/new',
      label: t('dashboard.actions.addProgram', 'إضافة برنامج'),
      icon: TrendingUp,
      color: 'success' as const,
      description: t('dashboard.actions.addProgramDesc', 'إنشاء برنامج جديد'),
    },
    {
      to: '/dashboard/donations/new',
      label: t('dashboard.actions.addDonation', 'تسجيل تبرع'),
      icon: DollarSign,
      color: 'warning' as const,
      description: t('dashboard.actions.addDonationDesc', 'تسجيل تبرع جديد'),
    },
    {
      to: '/dashboard/users/new',
      label: t('dashboard.actions.addUser', 'إضافة عضو'),
      icon: Users,
      color: 'info' as const,
      description: t('dashboard.actions.addUserDesc', 'إضافة عضو جديد'),
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getGrowthIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-4 h-4 text-primary-600" />;
      case 'program':
        return <TrendingUp className="w-4 h-4 text-primary-600" />;
      case 'donation':
        return <DollarSign className="w-4 h-4 text-primary-600" />;
      case 'user':
        return <Users className="w-4 h-4 text-primary-600" />;
      case 'contact':
        return <MessageCircle className="w-4 h-4 text-primary-600" />;
      case 'program_registration':
        return <Users className="w-4 h-4 text-primary-600" />;
      case 'event_registration':
        return <Calendar className="w-4 h-4 text-primary-600" />;
      default:
        return <Activity className="w-4 h-4 text-primary-600" />;
    }
  };

  // دالة التعامل مع الأزرار غير الفعالة
  const handleUnavailable = (
    msg = t('dashboard.unavailable', 'هذه الخاصية قيد التطوير، قريبًا!')
  ) => {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          لوحة التحكم الرئيسية
        </h1>
        <Link to="/">
          <Button
            variant="outline"
            className="font-bold text-primary-600 border-primary-300"
          >
            الصفحة الرئيسية
          </Button>
        </Link>
      </div>
      <div className="container mx-auto px-2 md:px-6 py-8">
        {/* Quick Actions */}
        <AccessibleSection>
          <Card className="mb-10 shadow-lg rounded-2xl p-6 bg-gradient-to-tr from-blue-50 to-white border-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                إجراءات سريعة
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                onClick={() => {
                  refetchStats();
                  refetchActivities();
                }}
                aria-label="تحديث البيانات"
              >
                تحديث
              </Button>
            </div>
            <QuickActions actions={quickActions} className="mb-0" />
          </Card>
        </AccessibleSection>

        {/* Stats Overview */}
        <AccessibleSection>
          <Card className="mb-8 shadow-md rounded-2xl p-6 bg-white border-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                نظرة عامة على الإحصائيات
              </h2>
              <div className="flex gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="week">الأسبوع</option>
                  <option value="month">الشهر</option>
                  <option value="quarter">الربع</option>
                  <option value="year">السنة</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.overview?.map((stat: any, index: number) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                        <IconComponent
                          className={`w-6 h-6 text-${stat.color}-600`}
                          aria-hidden="true"
                        />
                      </div>
                      {getGrowthIcon(stat.changeType)}
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === 'increase'
                            ? 'text-green-600'
                            : stat.changeType === 'decrease'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500">
                        من الفترة السابقة
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </AccessibleSection>

        {/* Engagement Stats */}
        <AccessibleSection>
          <Card className="mb-8 shadow-md rounded-2xl p-6 bg-white border-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                إحصائيات التفاعل
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.engagement?.map((stat: any, index: number) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                        <IconComponent
                          className={`w-6 h-6 text-${stat.color}-600`}
                          aria-hidden="true"
                        />
                      </div>
                      {stat.alert && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          {stat.alert}
                        </span>
                      )}
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </AccessibleSection>

        {/* Charts & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Simple Chart */}
          <AccessibleSection>
            <Card className="mb-8 shadow-md rounded-2xl p-6 bg-white border-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  نشاط التبرعات
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Download}
                  onClick={() =>
                    handleUnavailable('سيتم إضافة تصدير البيانات قريبًا')
                  }
                >
                  تصدير
                </Button>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    سيتم إضافة الرسوم البيانية التفاعلية قريبًا
                  </p>
                </div>
              </div>
            </Card>
          </AccessibleSection>

          {/* Recent Activities */}
          <AccessibleSection>
            <Card className="mb-8 shadow-md rounded-2xl p-6 bg-white border-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  الأنشطة الحديثة
                </h2>
                <Link
                  to="/dashboard/activities"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  عرض الكل
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity: any) => {
                  const StatusIcon = getStatusIcon(activity.status);
                  return (
                    <div
                      key={activity.id}
                      className={`p-4 rounded-lg border-l-4 ${getPriorityColor(
                        activity.priority
                      )} bg-gray-50 hover:bg-gray-100 transition-colors`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                              {getActivityIcon(activity.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {activity.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{activity.date}</span>
                              {activity.user && (
                                <span className="font-medium">
                                  {activity.user}
                                </span>
                              )}
                              {activity.details && (
                                <span className="text-gray-400">
                                  {activity.details}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {activity.status === 'completed'
                              ? 'مكتمل'
                              : activity.status === 'pending'
                              ? 'قيد الانتظار'
                              : 'تحذير'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </AccessibleSection>
        </div>

        {/* Quick Tasks */}
        <AccessibleSection>
          <Card className="mb-8 shadow-md rounded-2xl p-6 bg-white border-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                المهام السريعة
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon={Settings}
                onClick={() =>
                  handleUnavailable('سيتم إضافة إعدادات المهام قريبًا')
                }
              >
                إعدادات
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900">
                    مراجعة الرسائل
                  </h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  لديك 3 رسائل جديدة تحتاج إلى مراجعة
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  as="a"
                  href="/dashboard/contact-forms"
                >
                  عرض الرسائل
                </Button>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-900">
                    فعاليات قادمة
                  </h3>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  لديك 2 فعالية قادمة الأسبوع القادم
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  عرض الفعاليات
                </Button>
              </div>

              <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-yellow-900">التبرعات</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  إجمالي التبرعات هذا الشهر: $2,500
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                >
                  عرض التبرعات
                </Button>
              </div>
            </div>
          </Card>
        </AccessibleSection>

        {/* Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="تنبيه"
        >
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-700">{modalMsg}</p>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
