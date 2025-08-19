import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { getRecentActivities } from '../../services/dashboardApi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/PageLoadingSpinner';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import {
  AccessibleSection,
  SkipToContent,
} from '../../components/common/AccessibleComponents';
import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  FileText,
  Activity,
  Bell,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  message: string;
  date: string;
  status: 'completed' | 'pending' | 'warning' | 'info';
  icon: string;
  priority?: 'high' | 'medium' | 'low';
  user?: string;
  details?: string;
}

const ActivitiesDashboard: React.FC = () => {
  // جلب الأنشطة الحديثة
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: getRecentActivities,
    staleTime: 5 * 60 * 1000,
  });

  // حالة البحث والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // بيانات افتراضية للأنشطة
  const mockActivities: Activity[] = [
    {
      id: 1,
      type: 'event',
      message: 'تم إضافة فعالية جديدة: ورشة عمل الشباب',
      date: 'منذ ساعتين',
      status: 'completed',
      icon: 'Calendar',
      priority: 'high',
      user: 'أحمد محمد',
      details: 'تم إنشاء فعالية جديدة في قسم ورشات العمل',
    },
    {
      id: 2,
      type: 'donation',
      message: 'تم استلام تبرع جديد بقيمة 500 ريال',
      date: 'منذ 3 ساعات',
      status: 'completed',
      icon: 'DollarSign',
      priority: 'medium',
      user: 'فاطمة علي',
      details: 'تبرع نقدي عبر البطاقة الائتمانية',
    },
    {
      id: 3,
      type: 'program',
      message: 'تم تحديث برنامج التوعية الصحية',
      date: 'منذ 5 ساعات',
      status: 'pending',
      icon: 'TrendingUp',
      priority: 'low',
      user: 'عمر خالد',
      details: 'تحديث في محتوى البرنامج وإضافة مواد جديدة',
    },
    {
      id: 4,
      type: 'user',
      message: 'انضم 3 أعضاء جدد للمنظمة',
      date: 'منذ يوم واحد',
      status: 'completed',
      icon: 'Users',
      priority: 'medium',
      user: 'النظام',
      details: 'سارة أحمد، يوسف عبدالله، ليلى محمد',
    },
    {
      id: 5,
      type: 'alert',
      message: 'فعالية "ملتقى الشباب" تحتاج إلى تحديث',
      date: 'منذ يومين',
      status: 'warning',
      icon: 'AlertCircle',
      priority: 'high',
      user: 'النظام',
      details: 'البيانات غير مكتملة - مطلوب تحديث الصور والمعلومات',
    },
    {
      id: 6,
      type: 'system',
      message: 'تم تحديث النظام إلى الإصدار الجديد',
      date: 'منذ 3 أيام',
      status: 'completed',
      icon: 'Settings',
      priority: 'low',
      user: 'النظام',
      details: 'إصلاحات وتحسينات في الأداء',
    },
  ];

  const activities =
    data?.data && Array.isArray(data.data) && data.data.length > 0
      ? data.data
      : mockActivities;

  // فلترة الأنشطة
  const filteredActivities = activities.filter((activity: Activity) => {
    const matchesSearch =
      activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.user &&
        activity.user.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' || activity.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || activity.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // دالة جلب الأيقونة
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-primary-600" />;
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-yellow-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'CheckCircle':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-gray-600" />;
      case 'Settings':
        return <Settings className="w-5 h-5 text-purple-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'warning':
        return 'text-red-600 bg-red-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority?: string) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event':
        return 'bg-blue-100 text-blue-800';
      case 'donation':
        return 'bg-yellow-100 text-yellow-800';
      case 'program':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-purple-100 text-purple-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'event':
        return 'فعالية';
      case 'donation':
        return 'تبرع';
      case 'program':
        return 'برنامج';
      case 'user':
        return 'مستخدم';
      case 'alert':
        return 'تنبيه';
      case 'system':
        return 'نظام';
      default:
        return type;
    }
  };

  const exportActivities = () => {
    const csvContent = [
      ['النوع', 'الرسالة', 'التاريخ', 'الحالة', 'الأولوية', 'المستخدم'],
      ...filteredActivities.map((activity: Activity) => [
        getTypeText(activity.type),
        activity.message,
        activity.date,
        activity.status,
        activity.priority || 'غير محدد',
        activity.user || 'النظام',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `activities-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <DashboardLayout>
        <SkipToContent />
        <AccessibleSection>
          <Alert type="error" title="خطأ في تحميل الأنشطة">
            حدث خطأ أثناء جلب الأنشطة الحديثة. يرجى المحاولة مرة أخرى.
          </Alert>
        </AccessibleSection>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SkipToContent />
      <AccessibleSection>
        <div className="max-w-7xl mx-auto py-6 px-2 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                الأنشطة الحديثة
              </h1>
              <p className="text-gray-600">
                عرض أحدث الأنشطة والتغييرات في النظام
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                icon={<Download />}
                onClick={exportActivities}
                aria-label="تصدير الأنشطة"
              >
                تصدير
              </Button>
              <Button
                variant="secondary"
                icon={<RefreshCw />}
                aria-label="تحديث الأنشطة"
                onClick={() => refetch()}
              >
                تحديث
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="البحث في الأنشطة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rtl:pr-10 rtl:pl-4"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<Filter />}
                >
                  الفلاتر
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('all');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setSelectedPeriod('all');
                  }}
                >
                  إعادة تعيين
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      النوع
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الأنواع</option>
                      <option value="event">فعالية</option>
                      <option value="donation">تبرع</option>
                      <option value="program">برنامج</option>
                      <option value="user">مستخدم</option>
                      <option value="alert">تنبيه</option>
                      <option value="system">نظام</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الحالة
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="completed">مكتمل</option>
                      <option value="pending">قيد الانتظار</option>
                      <option value="warning">تحذير</option>
                      <option value="info">معلومات</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الأولوية
                    </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الأولويات</option>
                      <option value="high">عالية</option>
                      <option value="medium">متوسطة</option>
                      <option value="low">منخفضة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الفترة
                    </label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الفترات</option>
                      <option value="today">اليوم</option>
                      <option value="week">الأسبوع</option>
                      <option value="month">الشهر</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Activities List */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <Card className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    لا توجد أنشطة
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ||
                    typeFilter !== 'all' ||
                    statusFilter !== 'all' ||
                    priorityFilter !== 'all'
                      ? 'لا توجد أنشطة تطابق معايير البحث المحددة'
                      : 'لا توجد أنشطة حديثة لعرضها'}
                  </p>
                </Card>
              ) : (
                filteredActivities.map((activity: Activity) => (
                  <Card
                    key={activity.id}
                    className={`hover:shadow-lg transition-shadow border-l-4 ${getPriorityColor(
                      activity.priority
                    )}`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-full ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {getIcon(activity.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                  activity.type
                                )}`}
                              >
                                {getTypeText(activity.type)}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  activity.status
                                )}`}
                              >
                                {activity.status === 'completed'
                                  ? 'مكتمل'
                                  : activity.status === 'pending'
                                  ? 'قيد الانتظار'
                                  : activity.status === 'warning'
                                  ? 'تحذير'
                                  : 'معلومات'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {activity.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mb-1">
                            {activity.message}
                          </p>
                          {activity.details && (
                            <p className="text-xs text-gray-600 mb-2">
                              {activity.details}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              بواسطة: {activity.user || 'النظام'}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Eye />}
                                aria-label="عرض التفاصيل"
                                onClick={() => {
                                  // يمكن إضافة منطق عرض التفاصيل هنا
                                }}
                              >
                                عرض
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredActivities.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                عرض {filteredActivities.length} من {activities.length} نشاط
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  السابق
                </Button>
                <Button variant="secondary" size="sm">
                  التالي
                </Button>
              </div>
            </div>
          )}
        </div>
      </AccessibleSection>
    </DashboardLayout>
  );
};

export default ActivitiesDashboard;
