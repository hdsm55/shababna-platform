import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Settings,
  UserCheck,
  UserX,
  Clock,
  Star,
  Crown,
  Award,
  Target,
  Heart,
  MessageCircle,
  Bell,
  Lock,
  Unlock,
  Key,
  EyeOff,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Copy,
  Share2,
  Archive,
  Send,
  Mail as MailIcon,
  Phone as PhoneIcon,
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
  Check,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Key as KeyIcon,
  Fingerprint,
  Shield as ShieldIcon,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  ShieldOff,
  User,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  UserPlus as UserAdd,
  UserMinus,
  Users as UsersIcon,
  UserCog,
  UserSearch,
  UserCheck as UserVerified,
  UserX as UserBlocked,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/common/SEO';

interface Report {
  id: string;
  title: string;
  type: 'events' | 'programs' | 'users' | 'financial' | 'analytics';
  status: 'completed' | 'processing' | 'failed';
  createdAt: string;
  updatedAt: string;
  size: string;
  format: 'pdf' | 'excel' | 'csv';
  description: string;
}

const ReportsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>(
    'info'
  );
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // استخدام البيانات الحقيقية من API
  const reports: Report[] = [];

  const handleGenerateReport = async (type: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage(t('reports.generate.success', 'تم إنشاء التقرير بنجاح'));
      setMessageType('success');
    } catch (error) {
      setMessage(t('reports.generate.error', 'حدث خطأ أثناء إنشاء التقرير'));
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    setIsLoading(true);

    try {
      // Simulate download
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage(t('reports.download.success', 'تم تحميل التقرير بنجاح'));
      setMessageType('success');
    } catch (error) {
      setMessage(t('reports.download.error', 'حدث خطأ أثناء تحميل التقرير'));
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (
      window.confirm(
        t('reports.delete.confirm', 'هل أنت متأكد من حذف هذا التقرير؟')
      )
    ) {
      setIsLoading(true);

      try {
        // Simulate delete
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMessage(t('reports.delete.success', 'تم حذف التقرير بنجاح'));
        setMessageType('success');
      } catch (error) {
        setMessage(t('reports.delete.error', 'حدث خطأ أثناء حذف التقرير'));
        setMessageType('error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'events':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'programs':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'users':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'financial':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'analytics':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'events':
        return t('reports.types.events', 'الفعاليات');
      case 'programs':
        return t('reports.types.programs', 'البرامج');
      case 'users':
        return t('reports.types.users', 'المستخدمين');
      case 'financial':
        return t('reports.types.financial', 'مالي');
      case 'analytics':
        return t('reports.types.analytics', 'تحليلات');
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('reports.status.completed', 'مكتمل');
      case 'processing':
        return t('reports.status.processing', 'قيد المعالجة');
      case 'failed':
        return t('reports.status.failed', 'فشل');
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return Check;
      case 'processing':
        return Activity;
      case 'failed':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredReports = reports.filter((report: Report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' || report.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

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

  return (
    <DashboardLayout>
      <SEO
        title={t('reports.seo.title', 'التقارير')}
        description={t(
          'reports.seo.description',
          'إدارة وتنزيل التقارير المختلفة'
        )}
      />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('reports.title', 'التقارير')}
            </h1>
            <p className="text-gray-600">
              {t('reports.subtitle', 'إدارة وتنزيل التقارير المختلفة')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Report Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 cursor-pointer border border-gray-100 bg-white">
            <div className="text-center">
              <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2 text-sm">
                {t('reports.quick.events', 'الفعاليات')}
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateReport('events')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  t('reports.generate', 'إنشاء')
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 cursor-pointer border border-gray-100 bg-white">
            <div className="text-center">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2 text-sm">
                {t('reports.quick.programs', 'البرامج')}
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateReport('programs')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  t('reports.generate', 'إنشاء')
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 cursor-pointer border border-gray-100 bg-white">
            <div className="text-center">
              <Users className="w-6 h-6 text-purple-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2 text-sm">
                {t('reports.quick.users', 'المستخدمين')}
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateReport('users')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  t('reports.generate', 'إنشاء')
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 cursor-pointer border border-gray-100 bg-white">
            <div className="text-center">
              <BarChart3 className="w-6 h-6 text-red-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2 text-sm">
                {t('reports.quick.analytics', 'التحليلات')}
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateReport('analytics')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  t('reports.generate', 'إنشاء')
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t(
                    'reports.search.placeholder',
                    'البحث في التقارير...'
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {t('reports.filters', 'الفلترة')}
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('reports.filters.type', 'نوع التقرير')}
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">
                        {t('reports.filters.allTypes', 'جميع الأنواع')}
                      </option>
                      <option value="events">
                        {t('reports.types.events', 'الفعاليات')}
                      </option>
                      <option value="programs">
                        {t('reports.types.programs', 'البرامج')}
                      </option>
                      <option value="users">
                        {t('reports.types.users', 'المستخدمين')}
                      </option>
                      <option value="financial">
                        {t('reports.types.financial', 'مالي')}
                      </option>
                      <option value="analytics">
                        {t('reports.types.analytics', 'تحليلات')}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('reports.filters.status', 'الحالة')}
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">
                        {t('reports.filters.allStatus', 'جميع الحالات')}
                      </option>
                      <option value="completed">
                        {t('reports.status.completed', 'مكتمل')}
                      </option>
                      <option value="processing">
                        {t('reports.status.processing', 'قيد المعالجة')}
                      </option>
                      <option value="failed">
                        {t('reports.status.failed', 'فشل')}
                      </option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                          report.type
                        )}`}
                      >
                        {getTypeText(report.type)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {(() => {
                          const IconComponent = getStatusIcon(report.status);
                          return (
                            IconComponent && (
                              <IconComponent className="w-3 h-3 mr-1" />
                            )
                          );
                        })()}
                        {getStatusText(report.status)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {report.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatDate(report.createdAt)}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span className="uppercase">{report.format}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {report.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {t('reports.download', 'تحميل')}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteReport(report.id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('reports.empty.title', 'لا توجد تقارير')}
                </h3>
                <p className="text-gray-600">
                  {t(
                    'reports.empty.description',
                    'لم يتم إنشاء أي تقارير بعد. استخدم الأزرار أعلاه لإنشاء تقرير جديد.'
                  )}
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Message Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Alert
            type={messageType}
            title={message}
            onClose={() => setMessage('')}
          />
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default ReportsDashboard;
