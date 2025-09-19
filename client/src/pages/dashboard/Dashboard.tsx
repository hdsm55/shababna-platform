import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
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
  // إضافة أيقونات جديدة
  Users as UsersIcon,
  Calendar as CalendarIcon,
  FileText as FileTextIcon,
  MessageSquare,
  CreditCard,
  ShoppingCart,
  Gift as GiftIcon,
  TrendingUp as TrendingUpIcon,
  BarChart,
  PieChart as PieChartIcon,
  LineChart,
  Activity as ActivityIcon2,
  Zap as ZapIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  Star as StarIcon,
  Heart as HeartIcon2,
  Eye as EyeIcon,
  Clock as ClockIcon2,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  RefreshCw as RefreshCwIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Upload,
  Trash2 as TrashIcon,
  Edit as EditIcon,
  Copy as CopyIcon,
  Share2 as ShareIcon,
  ExternalLink as ExternalLinkIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  MoreHorizontal as MoreIcon,
  Bell as BellIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Globe as GlobeIcon,
  Wifi as WifiIcon,
  Signal as SignalIcon,
  Battery as BatteryIcon,
  Volume2 as VolumeIcon,
  Mic as MicIcon,
  Camera as CameraIcon,
  Monitor as MonitorIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Smartphone as SmartphoneIcon,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Cloud as CloudIcon,
  Shield as ShieldIcon,
  Crown as CrownIcon,
  Trophy as TrophyIcon,
  Medal as MedalIcon,
  Flag as FlagIcon,
  BookOpen as BookIcon,
  GraduationCap as GraduationIcon,
  Briefcase as BriefcaseIcon,
  Coffee as CoffeeIcon,
  Smile as SmileIcon,
  ThumbsUp as ThumbsUpIcon,
  Sparkles as SparklesIcon,
  Rocket as RocketIcon,
  Lightbulb as LightbulbIcon,
  Zap as ZapIcon2,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon,
  BarChart3 as BarChartIcon,
  PieChart as PieChartIcon2,
  Activity as ActivityIcon3,
  Target as TargetIcon2,
  Award as AwardIcon2,
  Star as StarIcon2,
  Heart as HeartIcon3,
  Eye as EyeIcon2,
  Clock as ClockIcon3,
  CheckCircle as CheckCircleIcon2,
  AlertCircle as AlertCircleIcon2,
  RefreshCw as RefreshCwIcon2,
  Settings as SettingsIcon2,
  Download as DownloadIcon2,
  Upload as UploadIcon,
  Trash2 as TrashIcon2,
  Edit as EditIcon2,
  Copy as CopyIcon2,
  Share2 as ShareIcon2,
  ExternalLink as ExternalLinkIcon2,
  Plus as PlusIcon2,
  Minus as MinusIcon2,
  ChevronRight as ChevronRightIcon2,
  ChevronLeft as ChevronLeftIcon2,
  Filter as FilterIcon2,
  Search as SearchIcon2,
  MoreHorizontal as MoreIcon2,
  Bell as BellIcon2,
  Mail as MailIcon2,
  Phone as PhoneIcon2,
  MapPin as MapPinIcon2,
  Globe as GlobeIcon2,
  Wifi as WifiIcon2,
  Signal as SignalIcon2,
  Battery as BatteryIcon2,
  Volume2 as VolumeIcon2,
  Mic as MicIcon2,
  Camera as CameraIcon2,
  Monitor as MonitorIcon2,
  Tablet as TabletIcon2,
  Laptop as LaptopIcon2,
  Smartphone as SmartphoneIcon2,
  Database as DatabaseIcon2,
  Server as ServerIcon2,
  Cloud as CloudIcon2,
  Shield as ShieldIcon2,
  Crown as CrownIcon2,
  Trophy as TrophyIcon2,
  Medal as MedalIcon2,
  Flag as FlagIcon2,
  BookOpen as BookIcon2,
  GraduationCap as GraduationIcon2,
  Briefcase as BriefcaseIcon2,
  Coffee as CoffeeIcon2,
  Smile as SmileIcon2,
  ThumbsUp as ThumbsUpIcon2,
  Sparkles as SparklesIcon2,
  Rocket as RocketIcon2,
  Lightbulb as LightbulbIcon2,
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

  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return Calendar;
      case 'TrendingUp':
        return TrendingUp;
      case 'Users':
        return Users;
      case 'Heart':
        return Heart;
      case 'MessageCircle':
        return MessageCircle;
      case 'DollarSign':
        return DollarSign;
      case 'Target':
        return Target;
      case 'UserPlus':
        return UserPlus;
      case 'FileText':
        return FileText;
      case 'Shield':
        return Shield;
      case 'Activity':
        return Activity;
      default:
        return Activity;
    }
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError || activitiesError) {
    return (
      <Alert
        type="error"
        title={t('dashboard.error.title', 'خطأ في تحميل البيانات')}
      >
        {t('dashboard.error.message', 'حدث خطأ أثناء تحميل بيانات الداشبورد')}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
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
              {t('dashboard.welcome', 'مرحباً')}{' '}
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.first_name || user?.email || 'مستخدم'}
            </h1>
            <p className="text-gray-500 text-sm">
              {t('dashboard.subtitle', 'نظرة شاملة على أداء النظام')}
            </p>
            {/* رسالة ترحيب للمستخدمين الجدد */}
            {user?.id === 2 && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  🎉 مرحباً بك في منصة شبابنا! تم إنشاء حسابك بنجاح.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="text-xs">
                <Home className="w-3 h-3 mr-1" />
                {t('dashboard.goToHome', 'الرئيسية')}
              </Button>
            </Link>
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
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}
                >
                  <img
                    src="/images/logo.jpg"
                    alt="شعار شبابنا"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {(() => {
                    const IconComponent = getGrowthIcon(stat.changeType);
                    return (
                      IconComponent && (
                        <IconComponent
                          className={`w-3 h-3 ${
                            stat.changeType === 'increase'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        />
                      )
                    );
                  })()}
                  <span
                    className={`text-xs ${
                      stat.changeType === 'increase'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.title}</div>
            </div>
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

            <div className="space-y-3">
              {Array.isArray(stats.engagement) &&
              stats.engagement.length > 0 ? (
                stats.engagement.map((metric: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg bg-${metric.color}-50 flex items-center justify-center`}
                      >
                        <img
                          src="/images/logo.jpg"
                          alt="شعار شبابنا"
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-800">
                          {metric.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          الهدف: {metric.target}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {metric.value}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${metric.color}-500 rounded-full`}
                            style={{ width: `${metric.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {metric.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-400">
                    {t(
                      'dashboard.noPerformance',
                      'لا توجد بيانات أداء متاحة حالياً.'
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="bg-white rounded-lg p-6 border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {t('dashboard.activities.title', 'الأنشطة الحديثة')}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUnavailable()}
                className="text-xs text-blue-600"
              >
                {t('dashboard.activities.viewAll', 'عرض الكل')}
              </Button>
            </div>

            <div className="space-y-2">
              {Array.isArray(activities) && activities.length > 0 ? (
                activities.slice(0, 5).map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg bg-${activity.color}-50 flex items-center justify-center flex-shrink-0`}
                    >
                      <img
                        src="/images/logo.jpg"
                        alt="شعار شبابنا"
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs text-gray-800 mb-1">
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {activity.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-400">
                    {t('dashboard.noActivities', 'لا توجد أنشطة متاحة حالياً.')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <div className="bg-white rounded-lg p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t('dashboard.quickActions.title', 'إجراءات سريعة')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/dashboard/events">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 p-3 h-auto text-xs w-full"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {t('dashboard.quickActions.newEvent', 'فعالية جديدة')}
                </span>
              </Button>
            </Link>
            <Link to="/dashboard/programs">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 p-3 h-auto text-xs w-full"
              >
                <Target className="w-4 h-4" />
                <span>
                  {t('dashboard.quickActions.newProgram', 'برنامج جديد')}
                </span>
              </Button>
            </Link>
            <Link to="/dashboard/users">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 p-3 h-auto text-xs w-full"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {t('dashboard.quickActions.newUser', 'مستخدم جديد')}
                </span>
              </Button>
            </Link>
            <Link to="/dashboard/blogs">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 p-3 h-auto text-xs w-full"
              >
                <FileText className="w-4 h-4" />
                <span>{t('dashboard.quickActions.newBlog', 'مقال جديد')}</span>
              </Button>
            </Link>
          </div>
        </div>
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
    </div>
  );
};

export default DashboardOverview;
