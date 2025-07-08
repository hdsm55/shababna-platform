import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { getRecentActivities } from '../../services/dashboardApi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
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
} from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  message: string;
  date: string;
  status: 'completed' | 'pending' | 'warning' | 'info';
  icon: string;
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
  const [showFilters, setShowFilters] = useState(false);

  // بيانات افتراضية للأنشطة
  const mockActivities: Activity[] = [
    {
      id: 1,
      type: 'event',
      message: 'تم إضافة فعالية جديدة: ورشة عمل الشباب',
      date: 'منذ ساعتين',
      status: 'completed',
      icon: 'Calendar',
    },
    {
      id: 2,
      type: 'donation',
      message: 'تم استلام تبرع جديد بقيمة 500 ريال',
      date: 'منذ 3 ساعات',
      status: 'completed',
      icon: 'DollarSign',
    },
    {
      id: 3,
      type: 'program',
      message: 'تم تحديث برنامج التوعية الصحية',
      date: 'منذ 5 ساعات',
      status: 'pending',
      icon: 'TrendingUp',
    },
    {
      id: 4,
      type: 'user',
      message: 'انضم 3 أعضاء جدد للمنظمة',
      date: 'منذ يوم واحد',
      status: 'completed',
      icon: 'Users',
    },
    {
      id: 5,
      type: 'alert',
      message: 'فعالية "ملتقى الشباب" تحتاج إلى تحديث',
      date: 'منذ يومين',
      status: 'warning',
      icon: 'AlertCircle',
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
      activity.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' || activity.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
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
      default:
        return <Eye className="w-5 h-5 text-gray-400" />;
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
        <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4 lg:px-8">
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
                icon={RefreshCw}
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
                  icon={Filter}
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
                  }}
                >
                  إعادة تعيين
                </Button>
              </div>
            </div>
            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع النشاط
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
                      <option value="user">عضو</option>
                      <option value="alert">تنبيه</option>
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
                      <option value="pending">قيد التنفيذ</option>
                      <option value="warning">تحذير</option>
                      <option value="info">معلومات</option>
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
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    لا يوجد أنشطة حديثة
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ||
                    typeFilter !== 'all' ||
                    statusFilter !== 'all'
                      ? 'لا يوجد أنشطة تطابق معايير البحث المحددة'
                      : 'ابدأ بإضافة أنشطة جديدة'}
                  </p>
                </Card>
              ) : (
                filteredActivities.map((activity: Activity) => (
                  <Card
                    key={activity.id}
                    className="flex items-center gap-4 p-4"
                  >
                    <div className="flex-shrink-0">
                      {getIcon(activity.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {activity.status === 'completed'
                            ? 'مكتمل'
                            : activity.status === 'pending'
                            ? 'قيد التنفيذ'
                            : activity.status === 'warning'
                            ? 'تحذير'
                            : 'معلومات'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {activity.date}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900 font-medium">
                        {activity.message}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="خيارات النشاط"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </AccessibleSection>
    </DashboardLayout>
  );
};

export default ActivitiesDashboard;
