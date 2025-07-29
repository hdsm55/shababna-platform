import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getRecentActivities,
} from '../../services/dashboardApi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
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
  Home,
  FileText,
  UserPlus,
  Gift,
  Zap,
  TrendingDown,
  Activity as ActivityIcon,
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  Play,
  Pause,
  StopCircle,
  CheckSquare,
  Square,
  Clock as ClockIcon,
  CalendarDays,
  MapPin,
  Globe,
  Sparkles,
  Rocket,
  Lightbulb,
  Shield,
  Crown,
  Trophy,
  Medal,
  Flag,
  BookOpen,
  GraduationCap,
  Briefcase,
  Coffee,
  Smile,
  ThumbsUp,
  Heart as HeartIcon,
  Share2,
  Copy,
  Edit,
  Trash2,
  Archive,
  Send,
  Mail,
  Phone,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Database,
  Server,
  Cloud,
  Wifi,
  Signal,
  Battery,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Headphones,
  Speaker,
  Radio,
  Tv,
  Smartphone as Mobile,
  Watch,
  Clock as TimeIcon,
  Calendar as DateIcon,
  Timer,
  TimerOff,
  Hourglass,
  History,
  Repeat,
  RotateCcw,
  RotateCw,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
  PlayCircle,
  PauseCircle,
  StopCircle as StopIcon,
  Square as SquareIcon,
  Circle,
  Dot,
  Minus as MinusIcon,
  Plus as PlusIcon,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  Lock,
  Unlock,
  Eye as EyeIcon,
  EyeOff,
  Key,
  Fingerprint,
  Shield as ShieldIcon,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  ShieldOff,
  User,
  UserCheck,
  UserX,
  UserPlus as UserAdd,
  UserMinus,
  Users as UsersIcon,
  UserCog,
  UserSearch,
  UserCheck as UserVerified,
  UserX as UserBlocked,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import QuickActions from '../../components/common/QuickActions';
import SEO from '../../components/common/SEO';

const DashboardOverview: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const isRTL = i18n.dir() === 'rtl';

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

  // استخدام البيانات الحقيقية من API
  const stats = statsData?.data || { overview: [], engagement: [] };
  const activities = activitiesData || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getGrowthIcon = (changeType: string) => {
    return changeType === 'increase' ? ArrowUpRight : ArrowDownRight;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'event_registration':
        return Calendar;
      case 'program_creation':
        return Target;
      case 'user_registration':
        return UserPlus;
      case 'content_update':
        return FileText;
      case 'system_alert':
        return Shield;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'event_registration':
        return 'blue';
      case 'program_creation':
        return 'purple';
      case 'user_registration':
        return 'green';
      case 'content_update':
        return 'orange';
      case 'system_alert':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return t('dashboard.status.success', 'نجاح');
      case 'warning':
        return t('dashboard.status.warning', 'تحذير');
      case 'error':
        return t('dashboard.status.error', 'خطأ');
      case 'info':
        return t('dashboard.status.info', 'معلومة');
      default:
        return status;
    }
  };

  const handleUnavailable = (
    msg = t('dashboard.unavailable', 'هذه الخاصية قيد التطوير، قريبًا!')
  ) => {
    setModalMsg(msg);
    setModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (statsLoading || activitiesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (statsError || activitiesError) {
    return (
      <DashboardLayout>
        <Alert
          type="error"
          title={t('dashboard.error.title', 'خطأ في تحميل البيانات')}
        >
          {t('dashboard.error.message', 'حدث خطأ أثناء تحميل بيانات الداشبورد')}
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO
        title={t('dashboard.seo.title', 'لوحة التحكم - نظرة عامة')}
        description={t(
          'dashboard.seo.description',
          'نظرة شاملة على إحصائيات وأداء النظام'
        )}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
              {t('dashboard.welcome', 'مرحباً')} {user?.first_name}
            </h1>
            <p className="text-gray-500 text-sm">
              {t('dashboard.subtitle', 'نظرة شاملة على أداء النظام')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchStats();
                refetchActivities();
              }}
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              {t('dashboard.refresh', 'تحديث')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.isArray(stats.overview) && stats.overview.length > 0 ? (
          stats.overview.map((stat: any, index: number) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}
                >
                  {(() => {
                    const IconComponent = stat.icon;
                    return (
                      IconComponent && (
                        <IconComponent
                          className={`w-5 h-5 text-${stat.color}-500`}
                        />
                      )
                    );
                  })()}
                </div>
                <div className="flex items-center gap-1">
                  {stat.change && (
                    <>
                      {(() => {
                        const IconComponent = getGrowthIcon(stat.changeType);
                        return (
                          IconComponent && (
                            <IconComponent
                              className={`w-3 h-3 ${
                                stat.changeType === 'increase'
                                  ? 'text-green-500'
                                  : stat.changeType === 'decrease'
                                  ? 'text-red-500'
                                  : stat.changeType === 'warning'
                                  ? 'text-yellow-500'
                                  : 'text-gray-500'
                              }`}
                            />
                          )
                        );
                      })()}
                      <span
                        className={`text-xs ${
                          stat.changeType === 'increase'
                            ? 'text-green-600'
                            : stat.changeType === 'decrease'
                            ? 'text-red-600'
                            : stat.changeType === 'warning'
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString('ar-SA')}
              </div>
              <div className="text-xs text-gray-500">{stat.title}</div>
              {stat.details && (
                <div className="mt-2 text-xs text-gray-400">
                  {stat.details.recent && (
                    <div>جديد هذا الأسبوع: {stat.details.recent}</div>
                  )}
                  {stat.details.pending && (
                    <div>معلق: {stat.details.pending}</div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-4 text-center py-8">
            <p className="text-sm text-gray-400">
              {t('dashboard.noStats', 'لا توجد بيانات إحصائية متاحة حالياً.')}
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {t('dashboard.performance.title', 'مقاييس الأداء')}
              </h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-xs border border-gray-200 rounded px-2 py-1"
              >
                <option value="week">
                  {t('dashboard.period.week', 'الأسبوع')}
                </option>
                <option value="month">
                  {t('dashboard.period.month', 'الشهر')}
                </option>
                <option value="quarter">
                  {t('dashboard.period.quarter', 'الربع')}
                </option>
                <option value="year">
                  {t('dashboard.period.year', 'السنة')}
                </option>
              </select>
            </div>

            <div className="space-y-4">
              {Array.isArray(stats.engagement) &&
              stats.engagement.length > 0 ? (
                stats.engagement.map((metric: any, index: number) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-${metric.color}-50 flex items-center justify-center`}
                      >
                        {(() => {
                          const IconComponent = metric.icon;
                          return (
                            IconComponent && (
                              <IconComponent
                                className={`w-5 h-5 text-${metric.color}-500`}
                              />
                            )
                          );
                        })()}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-800">
                          {metric.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          الهدف:{' '}
                          {metric.target?.toLocaleString('ar-SA') || 'غير محدد'}
                        </div>
                        {metric.alert && (
                          <div className="text-xs text-yellow-600 mt-1">
                            ⚠️ {metric.alert}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {metric.value.toLocaleString('ar-SA')}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${metric.color}-500 rounded-full transition-all duration-300`}
                            style={{ width: `${metric.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {metric.percentage}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">
                    {t(
                      'dashboard.noMetrics',
                      'لا توجد مقاييس أداء متاحة حالياً.'
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {t('dashboard.recentActivity.title', 'النشاط الحديث')}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchActivities()}
                className="text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                {t('dashboard.refresh', 'تحديث')}
              </Button>
            </div>

            <div className="space-y-3">
              {Array.isArray(activities) && activities.length > 0 ? (
                activities.slice(0, 5).map((activity: any, index: number) => (
                  <motion.div
                    key={activity.id || index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-${getActivityColor(
                        activity.type
                      )}-50 flex items-center justify-center mt-1`}
                    >
                      {(() => {
                        const IconComponent = getActivityIcon(activity.type);
                        return (
                          IconComponent && (
                            <IconComponent
                              className={`w-4 h-4 text-${getActivityColor(
                                activity.type
                              )}-500`}
                            />
                          )
                        );
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {activity.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.date}
                      </div>
                      {activity.user && (
                        <div className="text-xs text-gray-400 mt-1">
                          بواسطة: {activity.user}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">
                    {t('dashboard.noActivity', 'لا توجد أنشطة حديثة.')}
                  </p>
                </div>
              )}
            </div>

            {Array.isArray(activities) && activities.length > 5 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleUnavailable('سيتم إضافة صفحة الأنشطة قريباً')
                  }
                >
                  {t('dashboard.viewAll', 'عرض الكل')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions
          actions={[
            {
              to: '/dashboard/events/new',
              label: 'dashboard.quickActions.newEvent',
              icon: Calendar,
              color: 'primary',
              description: 'إضافة فعالية جديدة',
            },
            {
              to: '/dashboard/programs/new',
              label: 'dashboard.quickActions.newProgram',
              icon: TrendingUp,
              color: 'success',
              description: 'إضافة برنامج جديد',
            },
            {
              to: '/dashboard/users/new',
              label: 'dashboard.quickActions.newUser',
              icon: UserPlus,
              color: 'info',
              description: 'إضافة مستخدم جديد',
            },
            {
              to: '/dashboard/blogs/new',
              label: 'dashboard.quickActions.newBlog',
              icon: FileText,
              color: 'warning',
              description: 'إضافة مقال جديد',
            },
          ]}
        />
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('dashboard.modal.title', 'تنبيه')}
      >
        <p className="text-gray-600">{modalMsg}</p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            {t('common.close', 'إغلاق')}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardOverview;
