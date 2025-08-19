import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../services/dashboardApi';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  AccessibleSection,
  SkipToContent,
} from '../../components/common/AccessibleComponents';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/PageLoadingSpinner';
import Alert from '../../components/common/Alert';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Eye,
  Download,
  Filter,
  Calendar as CalendarIcon,
  MapPin,
  Target,
  Award,
  Star,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  BarChart,
  LineChart,
  PieChart as PieChartIcon,
  Download as DownloadIcon,
  RefreshCw,
  Settings,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalEvents: number;
    totalPrograms: number;
    growthRate: number;
    activeUsers: number;
    newUsers: number;
    conversionRate: number;
  };
  trends: {
    users: { date: string; count: number }[];
    events: { date: string; count: number }[];
    donations: { date: string; amount: number }[];
    engagement: { date: string; rate: number }[];
  };
  demographics: {
    ageGroups: { group: string; count: number; percentage: number }[];
    locations: { city: string; count: number; percentage: number }[];
    interests: { category: string; count: number; percentage: number }[];
  };
  performance: {
    topEvents: { name: string; participants: number; rating: number }[];
    topPrograms: { name: string; participants: number; completion: number }[];
    topDonors: { name: string; amount: number; count: number }[];
    topLocations: { city: string; events: number; participants: number }[];
  };
  insights: {
    peakHours: { hour: string; activity: number }[];
    popularCategories: { category: string; count: number }[];
    userRetention: { month: string; rate: number }[];
    donationPatterns: { method: string; amount: number; count: number }[];
  };
}

const AnalyticsDashboard: React.FC = () => {
  // جلب بيانات التحليلات
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: () => getDashboardStats(),
    staleTime: 5 * 60 * 1000,
  });

  // حالة النافذة المنبثقة
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string>('');
  const [dateRange, setDateRange] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');

  // استخدام البيانات الحقيقية من API
  const analytics = data || {
    overview: {
      totalUsers: 0,
      totalEvents: 0,
      totalPrograms: 0,
      growthRate: 0,
      activeUsers: 0,
      newUsers: 0,
      conversionRate: 0,
    },
    trends: {
      users: [],
      events: [],
      donations: [],
      engagement: [],
    },
    demographics: {
      ageGroups: [],
      locations: [],
      interests: [],
    },
    performance: {
      topEvents: [],
      topPrograms: [],
      topDonors: [],
      topLocations: [],
    },
    insights: {
      peakHours: [],
      popularCategories: [],
      userRetention: [],
      donationPatterns: [],
    },
  };

  const handleOpenModal = (chartType: string) => {
    setSelectedChart(chartType);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedChart('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (rate < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return 'text-green-600';
    if (rate < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'trends', label: 'الاتجاهات', icon: TrendingUp },
    { id: 'demographics', label: 'التركيبة السكانية', icon: Users },
    { id: 'performance', label: 'الأداء', icon: Target },
    { id: 'insights', label: 'الرؤى', icon: Eye },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <SkipToContent />
        <AccessibleSection>
          <Alert type="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء جلب بيانات التحليلات. يرجى المحاولة مرة أخرى.
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
                التقارير والتحليلات
              </h1>
              <p className="text-gray-600">
                تحليل شامل لأداء المنظمة وإحصائياتها
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                icon={<Download />}
                aria-label="تصدير التقارير"
              >
                تصدير
              </Button>
              <Button
                variant="secondary"
                icon={<RefreshCw />}
                aria-label="تحديث البيانات"
              >
                تحديث
              </Button>
            </div>
          </div>

          {/* Date Range Filter */}
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  الفترة الزمنية:
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="7">آخر 7 أيام</option>
                  <option value="30">آخر 30 يوم</option>
                  <option value="90">آخر 3 أشهر</option>
                  <option value="365">آخر سنة</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                آخر تحديث: {new Date().toLocaleDateString('en-US')}
              </div>
            </div>
          </Card>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <Card>
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card>
                        <div className="p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="mr-4 rtl:ml-4 rtl:mr-0">
                              <p className="text-sm font-medium text-gray-600">
                                إجمالي المستخدمين
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {formatNumber(analytics.overview.totalUsers)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center mt-4 text-sm">
                            {getGrowthIcon(analytics.overview.growthRate)}
                            <span
                              className={`mr-1 ${getGrowthColor(
                                analytics.overview.growthRate
                              )}`}
                            >
                              +{analytics.overview.growthRate}%
                            </span>
                            <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
                              من الشهر الماضي
                            </span>
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="mr-4 rtl:ml-4 rtl:mr-0">
                              <p className="text-sm font-medium text-gray-600">
                                إجمالي الفعاليات
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {formatNumber(analytics.overview.totalEvents)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center mt-4 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                            <span className="text-green-600">
                              {analytics.overview.activeUsers}
                            </span>
                            <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
                              مستخدم نشط
                            </span>
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Target className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="mr-4 rtl:ml-4 rtl:mr-0">
                              <p className="text-sm font-medium text-gray-600">
                                إجمالي البرامج
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {formatNumber(analytics.overview.totalPrograms)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center mt-4 text-sm">
                            <Star className="w-4 h-4 text-purple-600 mr-1" />
                            <span className="text-purple-600">
                              {analytics.overview.newUsers}
                            </span>
                            <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
                              مستخدم جديد
                            </span>
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <DollarSign className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="mr-4 rtl:ml-4 rtl:mr-0">
                              <p className="text-sm font-medium text-gray-600">
                                إجمالي التبرعات
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(
                                  analytics.overview.totalDonations
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center mt-4 text-sm">
                            <Heart className="w-4 h-4 text-yellow-600 mr-1" />
                            <span className="text-yellow-600">
                              {analytics.overview.conversionRate}%
                            </span>
                            <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
                              معدل التحويل
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              نمو المستخدمين
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal('users-trend')}
                              icon={<Eye />}
                            >
                              عرض التفاصيل
                            </Button>
                          </div>
                          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">رسم بياني تفاعلي</p>
                              <p className="text-sm text-gray-400">
                                سيتم إضافة مكتبة الرسوم البيانية
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              التبرعات الشهرية
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal('donations-trend')}
                              icon={<Eye />}
                            >
                              عرض التفاصيل
                            </Button>
                          </div>
                          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">رسم بياني تفاعلي</p>
                              <p className="text-sm text-gray-400">
                                سيتم إضافة مكتبة الرسوم البيانية
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Trends Tab */}
                {activeTab === 'trends' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      تحليل الاتجاهات
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            نمو المستخدمين
                          </h3>
                          <div className="space-y-3">
                            {analytics.trends.users
                              .slice(-6)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm text-gray-600">
                                    {item.date}
                                  </span>
                                  <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                      <div
                                        className="bg-primary-600 h-2 rounded-full"
                                        style={{
                                          width: `${
                                            (item.count / 1250) * 100
                                          }%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {formatNumber(item.count)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            نمو الفعاليات
                          </h3>
                          <div className="space-y-3">
                            {analytics.trends.events
                              .slice(-6)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm text-gray-600">
                                    {item.date}
                                  </span>
                                  <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                      <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{
                                          width: `${(item.count / 45) * 100}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {formatNumber(item.count)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Demographics Tab */}
                {activeTab === 'demographics' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      التركيبة السكانية
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            الفئات العمرية
                          </h3>
                          <div className="space-y-3">
                            {analytics.demographics.ageGroups.map(
                              (group, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm text-gray-600">
                                    {group.group}
                                  </span>
                                  <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{
                                          width: `${group.percentage}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {group.percentage}%
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            التوزيع الجغرافي
                          </h3>
                          <div className="space-y-3">
                            {analytics.demographics.locations.map(
                              (location, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm text-gray-600">
                                    {location.city}
                                  </span>
                                  <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                      <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{
                                          width: `${location.percentage}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {location.percentage}%
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            الاهتمامات
                          </h3>
                          <div className="space-y-3">
                            {analytics.demographics.interests.map(
                              (interest, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm text-gray-600">
                                    {interest.category}
                                  </span>
                                  <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                      <div
                                        className="bg-purple-600 h-2 rounded-full"
                                        style={{
                                          width: `${interest.percentage}%`,
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {interest.percentage}%
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      تحليل الأداء
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            أفضل الفعاليات
                          </h3>
                          <div className="space-y-4">
                            {analytics.performance.topEvents.map(
                              (event, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {event.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {event.participants} مشارك
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {event.rating}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            أفضل البرامج
                          </h3>
                          <div className="space-y-4">
                            {analytics.performance.topPrograms.map(
                              (program, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {program.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {program.participants} مشارك
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {program.completion}%
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            أفضل المتبرعين
                          </h3>
                          <div className="space-y-4">
                            {analytics.performance.topDonors.map(
                              (donor, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {donor.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {donor.count} تبرع
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-medium text-gray-900">
                                      {formatCurrency(donor.amount)}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            أفضل المواقع
                          </h3>
                          <div className="space-y-4">
                            {analytics.performance.topLocations.map(
                              (location, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {location.city}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {location.events} فعالية
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-medium text-gray-900">
                                      {location.participants} مشارك
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      الرؤى والتحليلات
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            ساعات الذروة
                          </h3>
                          <div className="space-y-3">
                            {analytics.insights.peakHours.map((hour, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-600">
                                  {hour.hour}
                                </span>
                                <div className="flex items-center">
                                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{
                                        width: `${
                                          (hour.activity / 120) * 100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {hour.activity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>

                      <Card>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            أنماط التبرعات
                          </h3>
                          <div className="space-y-4">
                            {analytics.insights.donationPatterns.map(
                              (pattern, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {pattern.method}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {pattern.count} معاملة
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-medium text-gray-900">
                                      {formatCurrency(pattern.amount)}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>

                    <Card>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          معدل الاحتفاظ بالمستخدمين
                        </h3>
                        <div className="space-y-3">
                          {analytics.insights.userRetention.map(
                            (retention, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-600">
                                  {retention.month}
                                </span>
                                <div className="flex items-center">
                                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full"
                                      style={{ width: `${retention.rate}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {retention.rate}%
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal for Chart Details */}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            title={`تفاصيل ${
              selectedChart === 'users-trend'
                ? 'نمو المستخدمين'
                : 'التبرعات الشهرية'
            }`}
          >
            <div className="space-y-4">
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">رسم بياني تفاعلي مفصل</p>
                  <p className="text-sm text-gray-400">
                    سيتم إضافة مكتبة الرسوم البيانية
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  icon={<Download />}
                  className="flex-1"
                >
                  تصدير البيانات
                </Button>
                <Button onClick={handleCloseModal} className="flex-1">
                  إغلاق
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </AccessibleSection>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
