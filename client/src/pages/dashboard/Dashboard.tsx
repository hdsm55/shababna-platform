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
import UnifiedLoader from '../../components/common/UnifiedLoader';
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

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
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
        return AlertCircle;
      case 'error':
        return AlertCircle;
      case 'info':
        return Clock;
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchActivities()]);
    } finally {
      setIsRefreshing(false);
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
          <UnifiedLoader type="centered" size="lg" />
        </div>
      </div>
    );
  }

  if (statsError || activitiesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        <div className="relative z-10 p-6">
          <Alert
            type="error"
            title={t('dashboard.error.title', 'خطأ في تحميل البيانات')}
          >
            {t(
              'dashboard.error.message',
              'حدث خطأ أثناء تحميل بيانات الداشبورد'
            )}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <SEO
          title={t('dashboard.seo.title', 'لوحة التحكم - نظرة عامة')}
          description={t(
            'dashboard.seo.description',
            'نظرة شاملة على إحصائيات وأداء النظام'
          )}
        />

        {/* Enhanced Header Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1">
                    {t('dashboard.welcome', 'مرحباً')} {user?.first_name}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {t('dashboard.subtitle', 'نظرة شاملة على أداء النظام')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isRefreshing ? 'animate-spin' : ''
                    }`}
                  />
                  {t('dashboard.refresh', 'تحديث')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnavailable()}
                  className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('dashboard.settings', 'الإعدادات')}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Array.isArray(stats.overview) && stats.overview.length > 0 ? (
            stats.overview.map((stat: any, index: number) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const IconComponent = getGrowthIcon(stat.changeType);
                        return (
                          IconComponent && (
                            <div
                              className={`p-2 rounded-lg ${
                                stat.changeType === 'increase'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                          )
                        );
                      })()}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{stat.title}</div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${
                        stat.changeType === 'increase'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full transition-all duration-1000`}
                        style={{
                          width: `${Math.min(stat.percentage || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div className="col-span-full" variants={itemVariants}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">
                  {t(
                    'dashboard.noStats',
                    'لا توجد بيانات إحصائية متاحة حالياً.'
                  )}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="mt-2"
                >
                  {t('dashboard.refresh', 'تحديث')}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Performance Metrics */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {t('dashboard.performance.title', 'مقاييس الأداء')}
                  </h2>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600 flex items-center justify-center shadow-lg`}
                        >
                          <metric.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 mb-1">
                            {metric.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            الهدف: {metric.target}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {metric.value}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
                            {metric.percentage}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      {t(
                        'dashboard.noPerformance',
                        'لا توجد بيانات أداء متاحة حالياً.'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Recent Activities */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {t('dashboard.activities.title', 'الأنشطة الحديثة')}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnavailable()}
                  className="text-primary-600 hover:bg-primary-50"
                >
                  {t('dashboard.activities.viewAll', 'عرض الكل')}
                </Button>
              </div>

              <div className="space-y-3">
                {Array.isArray(activities) && activities.length > 0 ? (
                  activities.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${activity.color}-500 to-${activity.color}-600 flex items-center justify-center flex-shrink-0 shadow-md`}
                      >
                        <activity.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                          {activity.title}
                        </div>
                        <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {activity.description}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      {t(
                        'dashboard.noActivities',
                        'لا توجد أنشطة متاحة حالياً.'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Quick Actions */}
        <motion.div
          className="mt-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {t('dashboard.quickActions.title', 'إجراءات سريعة')}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full flex flex-col items-center gap-3 p-4 h-auto bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300"
                  onClick={() => handleUnavailable()}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {t('dashboard.quickActions.newEvent', 'فعالية جديدة')}
                  </span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full flex flex-col items-center gap-3 p-4 h-auto bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300"
                  onClick={() => handleUnavailable()}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {t('dashboard.quickActions.newProgram', 'برنامج جديد')}
                  </span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full flex flex-col items-center gap-3 p-4 h-auto bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300"
                  onClick={() => handleUnavailable()}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {t('dashboard.quickActions.newUser', 'مستخدم جديد')}
                  </span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full flex flex-col items-center gap-3 p-4 h-auto bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300"
                  onClick={() => handleUnavailable()}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {t('dashboard.quickActions.newBlog', 'مقال جديد')}
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

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
    </div>
  );
};

export default Dashboard;
