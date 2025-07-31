import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchEvents,
  createEvent,
  updateEvent,
} from '../../services/eventsApi';
import { deleteEvent } from '../../services/dashboardApi';
import { Button } from '../../components/ui/Button/Button';
import Modal from '../../components/common/Modal';
import { Card } from '../../components/ui/Card/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { Input } from '../../components/ui/Input/Input';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Star,
  TrendingUp,
  DollarSign,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  Settings,
  UserCheck,
  UserX,
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
  // UserSearch, // Removed - not available in lucide-react
  UserCheck as UserVerified,
  UserX as UserBlocked,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
  max_attendees?: number;
  attendees?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const EventsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isRTL = i18n.dir() === 'rtl';

  // جلب قائمة الفعاليات
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: () => fetchEvents({ page: 1, limit: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  // حالة النافذة المنبثقة
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');

  // حالة الفلترة والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // نموذج البيانات
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    start_date: '',
    end_date: '',
    max_attendees: '',
    attendees: '',
    image_url: '',
    status: 'upcoming',
  });
  const [formError, setFormError] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // حالة التنبيه
  const [modalMsg, setModalMsg] = useState('');

  // استخدام البيانات الحقيقية من API
  const events = data?.data?.events || [];
  console.log('📊 البيانات المستلمة من API:', data);
  console.log('📋 قائمة الفعاليات:', events);

  const handleOpenModal = (type: 'add' | 'edit' | 'view', event?: Event) => {
    setModalType(type);
    if (event) {
      setSelectedEvent(event);
      setForm({
        title: event.title,
        description: event.description,
        category: event.category,
        location: event.location,
        start_date: event.start_date.split('T')[0],
        end_date: event.end_date.split('T')[0],
        max_attendees: event.max_attendees?.toString() || '',
        attendees: event.attendees?.toString() || '',
        image_url: event.image_url || '',
        status: event.status,
      });
      setImagePreview(event.image_url || null);
    } else {
      setSelectedEvent(null);
      setForm({
        title: '',
        description: '',
        category: '',
        location: '',
        start_date: '',
        end_date: '',
        max_attendees: '',
        attendees: '',
        image_url: '',
        status: 'upcoming',
      });
      setImagePreview(null);
    }
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setFormError('');
    setImage(null);
    setImagePreview(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setForm({ ...form, image_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // التحقق من صحة البيانات
    if (
      !form.title ||
      !form.description ||
      !form.location ||
      !form.start_date ||
      !form.end_date
    ) {
      setFormError(
        t('events.form.requiredFields', 'جميع الحقول المطلوبة يجب ملؤها')
      );
      return;
    }

    if (new Date(form.start_date) >= new Date(form.end_date)) {
      setFormError(
        t(
          'events.form.dateError',
          'تاريخ البداية يجب أن يكون قبل تاريخ النهاية'
        )
      );
      return;
    }

    try {
      const eventData = {
        ...form,
        max_attendees: form.max_attendees
          ? parseInt(form.max_attendees)
          : undefined,
        attendees: form.attendees ? parseInt(form.attendees) : 0,
        status: form.status as
          | 'upcoming'
          | 'active'
          | 'completed'
          | 'cancelled',
      };

      if (modalType === 'add') {
        await createEvent(eventData);
        setModalMsg(
          `✅ تم إنشاء الفعالية "${form.title}" بنجاح! 🎉\n\n` +
            `📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}\n` +
            `📍 الموقع: ${form.location}\n` +
            `👥 الحد الأقصى: ${form.max_attendees || 'غير محدد'} مشارك`
        );
      } else if (modalType === 'edit' && selectedEvent) {
        await updateEvent(selectedEvent.id, eventData);
        setModalMsg(
          `✅ تم تحديث الفعالية "${form.title}" بنجاح! 🔄\n\n` +
            `📅 آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}\n` +
            `📍 الموقع: ${form.location}\n` +
            `👥 الحد الأقصى: ${form.max_attendees || 'غير محدد'} مشارك\n` +
            `📊 المشاركين الحاليين: ${form.attendees || 0}`
        );
      }

      queryClient.invalidateQueries(['dashboard-events']);
      handleCloseModal();
    } catch (error: any) {
      console.error('❌ خطأ في حفظ الفعالية:', error);

      // رسائل خطأ مفصلة حسب نوع الخطأ
      let errorMessage = 'حدث خطأ أثناء حفظ البيانات';

      if (error.response?.status === 400) {
        errorMessage =
          '❌ بيانات غير صحيحة:\n' +
          (error.response.data?.message ||
            'يرجى التحقق من جميع الحقول المطلوبة');
      } else if (error.response?.status === 401) {
        errorMessage =
          '❌ غير مصرح لك بإجراء هذا الإجراء\nيرجى تسجيل الدخول مرة أخرى';
      } else if (error.response?.status === 404) {
        errorMessage = '❌ الفعالية غير موجودة\nربما تم حذفها من قبل';
      } else if (error.response?.status === 500) {
        errorMessage = '❌ خطأ في الخادم\nيرجى المحاولة مرة أخرى لاحقاً';
      } else if (error.message?.includes('Network Error')) {
        errorMessage = '❌ مشكلة في الاتصال\nيرجى التحقق من اتصال الإنترنت';
      } else if (error.message?.includes('timeout')) {
        errorMessage = '❌ انتهت مهلة الطلب\nيرجى المحاولة مرة أخرى';
      }

      setFormError(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return t('events.status.upcoming', 'قادمة');
      case 'active':
        return t('events.status.active', 'نشطة');
      case 'completed':
        return t('events.status.completed', 'مكتملة');
      case 'cancelled':
        return t('events.status.cancelled', 'ملغية');
      default:
        return status;
    }
  };

  const getRegistrationPercentage = (registered: number, capacity: number) => {
    if (!capacity) return 0;
    return Math.round((registered / capacity) * 100);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'غير محدد';
    }
  };

  const handleDelete = async (id: number) => {
    const eventToDelete = events.find((event) => event.id === id);
    const eventTitle = eventToDelete?.title || 'الفعالية';

    if (
      window.confirm(
        `🗑️ هل أنت متأكد من حذف الفعالية "${eventTitle}"؟\n\n` +
          `⚠️ هذا الإجراء لا يمكن التراجع عنه\n` +
          `📊 سيتم حذف جميع البيانات المرتبطة بالفعالية`
      )
    ) {
      try {
        await deleteEvent(id.toString());
        queryClient.invalidateQueries(['dashboard-events']);
        setModalMsg(
          `✅ تم حذف الفعالية "${eventTitle}" بنجاح! 🗑️\n\n` +
            `📅 تاريخ الحذف: ${new Date().toLocaleDateString('ar-SA')}\n` +
            `📊 تم حذف جميع البيانات المرتبطة بالفعالية`
        );
      } catch (error: any) {
        console.error('❌ خطأ في حذف الفعالية:', error);

        let errorMessage = 'حدث خطأ أثناء حذف الفعالية';

        if (error.response?.status === 404) {
          errorMessage = `❌ الفعالية "${eventTitle}" غير موجودة\nربما تم حذفها من قبل`;
        } else if (error.response?.status === 401) {
          errorMessage =
            '❌ غير مصرح لك بحذف الفعاليات\nيرجى تسجيل الدخول مرة أخرى';
        } else if (error.response?.status === 500) {
          errorMessage = '❌ خطأ في الخادم\nيرجى المحاولة مرة أخرى لاحقاً';
        } else if (error.message?.includes('Network Error')) {
          errorMessage = '❌ مشكلة في الاتصال\nيرجى التحقق من اتصال الإنترنت';
        }

        setFormError(errorMessage);
      }
    }
  };

  const handleUnavailable = (
    msg = t('events.unavailable', 'هذه الخاصية قيد التطوير، قريبًا!')
  ) => {
    setModalMsg(msg);
    setModalOpen(true);
  };

  const filteredEvents = events.filter((event: Event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || event.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || event.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.start_date).getTime();
        bValue = new Date(b.start_date).getTime();
        break;
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'attendees':
        aValue = a.attendees || 0;
        bValue = b.attendees || 0;
        break;
      default:
        aValue = new Date(a.start_date).getTime();
        bValue = new Date(b.start_date).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        title={t('events.error.title', 'خطأ في تحميل البيانات')}
      >
        {t('events.error.message', 'حدث خطأ أثناء تحميل بيانات الفعاليات')}
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SEO
        title={t('events.seo.title', 'إدارة الفعاليات')}
        description={t(
          'events.seo.description',
          'إدارة الفعاليات والأنشطة في المنصة'
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
              {t('events.title', 'إدارة الفعاليات')}
            </h1>
            <p className="text-gray-600">
              {t('events.subtitle', 'إدارة الفعاليات والأنشطة في المنصة')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('events.refresh', 'تحديث')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenModal('add')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('events.addNew', 'إضافة فعالية')}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-600">
                  {t('events.stats.total', 'إجمالي')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {events.length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('events.stats.totalEvents', 'إجمالي الفعاليات')}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-green-600">
                  {t('events.stats.active', 'نشطة')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {events.filter((e: Event) => e.status === 'active').length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('events.stats.activeEvents', 'الفعاليات النشطة')}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-yellow-600">
                  {t('events.stats.upcoming', 'قادمة')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {events.filter((e: Event) => e.status === 'upcoming').length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('events.stats.upcomingEvents', 'الفعاليات القادمة')}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-600">
                  {t('events.stats.attendees', 'مشاركين')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {events.reduce((sum, e) => {
                  const attendees = parseInt(e.attendees?.toString() || '0') || 0;
                  return sum + attendees;
                }, 0)}
              </h3>
              <p className="text-sm text-gray-600">
                {t('events.stats.totalAttendees', 'إجمالي المشاركين')}
              </p>
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
        <Card className="p-6 bg-gradient-to-r from-white to-primary-50 border-primary-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t(
                    'events.search.placeholder',
                    'البحث في الفعاليات...'
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-white border-primary-200 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border-primary-200 hover:border-primary-300 hover:bg-primary-50"
              >
                <Filter className="w-4 h-4" />
                {t('events.filters', 'الفلترة')}
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnavailable()}
                className="flex items-center gap-2 bg-white border-primary-200 hover:border-primary-300 hover:bg-primary-50"
              >
                <Download className="w-4 h-4" />
                {t('events.export', 'تصدير')}
              </Button>
            </div>
          </div>

          {/* Advanced Filters - Enhanced */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-primary-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('events.filters.status', 'الحالة')}
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="all">
                      {t('events.filters.allStatus', 'جميع الحالات')}
                    </option>
                    <option value="upcoming">
                      {t('events.filters.upcoming', 'قادمة')}
                    </option>
                    <option value="ongoing">
                      {t('events.filters.ongoing', 'جارية')}
                    </option>
                    <option value="completed">
                      {t('events.filters.completed', 'مكتملة')}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('events.filters.category', 'الفئة')}
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="all">
                      {t('events.filters.allCategories', 'جميع الفئات')}
                    </option>
                    <option value="workshop">
                      {t('events.filters.workshop', 'ورش عمل')}
                    </option>
                    <option value="conference">
                      {t('events.filters.conference', 'مؤتمرات')}
                    </option>
                    <option value="networking">
                      {t('events.filters.networking', 'شبكة تواصل')}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('events.filters.sort', 'ترتيب حسب')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="date">
                      {t('events.filters.sortByDate', 'التاريخ')}
                    </option>
                    <option value="title">
                      {t('events.filters.sortByTitle', 'العنوان')}
                    </option>
                    <option value="category">
                      {t('events.filters.sortByCategory', 'الفئة')}
                    </option>
                    <option value="status">
                      {t('events.filters.sortByStatus', 'الحالة')}
                    </option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Events Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/dashboard/events/${event.id}`)
                        }
                        className="p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal('edit', event)}
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {formatDate(event.start_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {event.attendees || 0} / {event.max_attendees || '∞'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {getStatusText(event.status)}
                      </span>

                      {event.max_attendees && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full transition-all duration-500"
                              style={{
                                width: `${getRegistrationPercentage(
                                  event.attendees || 0,
                                  event.max_attendees
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {getRegistrationPercentage(
                              event.attendees || 0,
                              event.max_attendees
                            )}
                            %
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalType === 'add'
            ? t('events.modal.addTitle', 'إضافة فعالية جديدة')
            : modalType === 'edit'
            ? t('events.modal.editTitle', 'تعديل الفعالية')
            : t('events.modal.viewTitle', 'تفاصيل الفعالية')
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('events.form.title', 'عنوان الفعالية')} *
              </label>
              <Input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('events.form.category', 'الفئة')} *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">
                  {t('events.form.selectCategory', 'اختر الفئة')}
                </option>
                <option value="تدريب">
                  {t('events.categories.training', 'تدريب')}
                </option>
                <option value="تطوع">
                  {t('events.categories.volunteer', 'تطوع')}
                </option>
                <option value="تقنية">
                  {t('events.categories.tech', 'تقنية')}
                </option>
                <option value="صحة">
                  {t('events.categories.health', 'صحة')}
                </option>
                <option value="أعمال">
                  {t('events.categories.business', 'أعمال')}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('events.form.description', 'وصف الفعالية')} *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              disabled={modalType === 'view'}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('events.form.location', 'الموقع')} *
              </label>
              <Input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('events.form.status', 'الحالة')}
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={modalType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="upcoming">
                  {t('events.status.upcoming', 'قادمة')}
                </option>
                <option value="active">
                  {t('events.status.active', 'نشطة')}
                </option>
                <option value="completed">
                  {t('events.status.completed', 'مكتملة')}
                </option>
                <option value="cancelled">
                  {t('events.status.cancelled', 'ملغية')}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('events.form.startDate', 'تاريخ البداية')} *
              </label>
              <Input
                type="datetime-local"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('events.form.endDate', 'تاريخ النهاية')} *
              </label>
              <Input
                type="datetime-local"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('events.form.maxAttendees', 'الحد الأقصى للمشاركين')}
              </label>
              <Input
                type="number"
                name="max_attendees"
                value={form.max_attendees}
                onChange={handleChange}
                disabled={modalType === 'view'}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('events.form.currentAttendees', 'المشاركين الحاليين')}
              </label>
              <Input
                type="number"
                name="attendees"
                value={form.attendees}
                onChange={handleChange}
                disabled={modalType === 'view'}
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('events.form.image', 'صورة الفعالية')}
            </label>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={modalType === 'view'}
              />
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    disabled={modalType === 'view'}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {formError && <Alert type="error" title={formError} />}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal}>
              {t('common.cancel', 'إلغاء')}
            </Button>
            {modalType !== 'view' && (
              <Button type="submit" variant="primary">
                {modalType === 'add'
                  ? t('events.form.add', 'إضافة')
                  : t('events.form.update', 'تحديث')}
              </Button>
            )}
          </div>
        </form>
      </Modal>

      {/* Success Message Modal */}
      <Modal
        open={!!modalMsg}
        onClose={() => setModalMsg('')}
        title="نجح العملية! 🎉"
      >
        <div className="text-center py-6">
          <div className="text-green-600 text-lg mb-6 whitespace-pre-line">
            {modalMsg}
          </div>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => setModalMsg('')}
              variant="primary"
              className="px-6"
            >
              تم
            </Button>
            <Button
              onClick={() => {
                setModalMsg('');
                handleCloseModal();
              }}
              variant="outline"
              className="px-6"
            >
              إغلاق النافذة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventsDashboard;
