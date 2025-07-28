import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchPrograms,
  createProgram,
  updateProgram,
} from '../../services/programsApi';
import { deleteProgram } from '../../services/dashboardApi';
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
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  Settings,
  UserCheck,
  UserX,
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
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/common/SEO';

interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  start_date: string;
  end_date: string;
  participants_count: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

const ProgramsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isRTL = i18n.dir() === 'rtl';

  // جلب قائمة البرامج
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-programs'],
    queryFn: () => fetchPrograms({ page: 1, limit: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  // حالة النافذة المنبثقة
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
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
    goal_amount: '',
    start_date: '',
    end_date: '',
  });
  const [formError, setFormError] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // حالة التنبيه
  const [modalMsg, setModalMsg] = useState('');

  // استخدام البيانات الحقيقية من API
  const programs = data?.data?.items || [];

  const handleOpenModal = (
    type: 'add' | 'edit' | 'view',
    program?: Program
  ) => {
    setModalType(type);
    if (program) {
      setSelectedProgram(program);
      setForm({
        title: program.title,
        description: program.description,
        category: program.category,
        goal_amount: program.goal_amount.toString(),
        start_date: program.start_date.split('T')[0],
        end_date: program.end_date.split('T')[0],
      });
      setImagePreview(program.image_url || null);
    } else {
      setSelectedProgram(null);
      setForm({
        title: '',
        description: '',
        category: '',
        goal_amount: '',
        start_date: '',
        end_date: '',
      });
      setImagePreview(null);
    }
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProgram(null);
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
      !form.category ||
      !form.goal_amount ||
      !form.start_date ||
      !form.end_date
    ) {
      setFormError(
        t('programs.form.requiredFields', 'جميع الحقول المطلوبة يجب ملؤها')
      );
      return;
    }

    if (new Date(form.start_date) >= new Date(form.end_date)) {
      setFormError(
        t(
          'programs.form.dateError',
          'تاريخ البداية يجب أن يكون قبل تاريخ النهاية'
        )
      );
      return;
    }

    if (parseFloat(form.goal_amount) <= 0) {
      setFormError(
        t('programs.form.amountError', 'المبلغ المطلوب يجب أن يكون أكبر من صفر')
      );
      return;
    }

    try {
      const programData = {
        ...form,
        goal_amount: parseFloat(form.goal_amount),
        current_amount: selectedProgram?.current_amount || 0,
        participants_count: selectedProgram?.participants_count || 0,
      };

      if (modalType === 'add') {
        await createProgram(programData);
        setModalMsg(t('programs.success.created', 'تم إنشاء البرنامج بنجاح'));
      } else if (modalType === 'edit' && selectedProgram) {
        await updateProgram(selectedProgram.id, programData);
        setModalMsg(t('programs.success.updated', 'تم تحديث البرنامج بنجاح'));
      }

      queryClient.invalidateQueries(['dashboard-programs']);
      handleCloseModal();
    } catch (error) {
      setFormError(t('programs.error.general', 'حدث خطأ أثناء حفظ البيانات'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('programs.status.active', 'نشط');
      case 'completed':
        return t('programs.status.completed', 'مكتمل');
      case 'pending':
        return t('programs.status.pending', 'قيد الانتظار');
      case 'cancelled':
        return t('programs.status.cancelled', 'ملغي');
      default:
        return status;
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    if (!goal) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'غير محدد';
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        t('programs.delete.confirm', 'هل أنت متأكد من حذف هذا البرنامج؟')
      )
    ) {
      try {
        await deleteProgram(id);
        queryClient.invalidateQueries(['dashboard-programs']);
        setModalMsg(t('programs.success.deleted', 'تم حذف البرنامج بنجاح'));
      } catch (error) {
        setFormError(t('programs.error.delete', 'حدث خطأ أثناء حذف البرنامج'));
      }
    }
  };

  const handleUnavailable = (
    msg = t('programs.unavailable', 'هذه الخاصية قيد التطوير، قريبًا!')
  ) => {
    setModalMsg(msg);
    setModalOpen(true);
  };

  const filteredPrograms = programs.filter((program: Program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || program.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || program.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
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
      case 'amount':
        aValue = a.current_amount;
        bValue = b.current_amount;
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
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert
          type="error"
          title={t('programs.error.title', 'خطأ في تحميل البيانات')}
          message={t(
            'programs.error.message',
            'حدث خطأ أثناء تحميل بيانات البرامج'
          )}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO
        title={t('programs.seo.title', 'إدارة البرامج')}
        description={t(
          'programs.seo.description',
          'إدارة البرامج والمشاريع في المنصة'
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
              {t('programs.title', 'إدارة البرامج')}
            </h1>
            <p className="text-gray-600">
              {t('programs.subtitle', 'إدارة البرامج والمشاريع في المنصة')}
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
              {t('programs.refresh', 'تحديث')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenModal('add')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('programs.addNew', 'إضافة برنامج')}
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
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-600">
                  {t('programs.stats.total', 'إجمالي')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {programs.length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('programs.stats.totalPrograms', 'إجمالي البرامج')}
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
                  {t('programs.stats.active', 'نشط')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {programs.filter((p: Program) => p.status === 'active').length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('programs.stats.activePrograms', 'البرامج النشطة')}
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
                  {t('programs.stats.pending', 'قيد الانتظار')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {programs.filter((p: Program) => p.status === 'pending').length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('programs.stats.pendingPrograms', 'البرامج قيد الانتظار')}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-600">
                  {t('programs.stats.funding', 'تمويل')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                ₺
                {programs
                  .reduce((sum, p) => sum + (p.current_amount || 0), 0)
                  .toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">
                {t('programs.stats.totalFunding', 'إجمالي التمويل')}
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
        <Card className="p-6 bg-gradient-to-r from-white to-accent-50 border-accent-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t(
                    'programs.search.placeholder',
                    'البحث في البرامج...'
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-white border-accent-200 focus:border-accent-500 focus:ring-accent-500 shadow-sm"
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
                className="flex items-center gap-2 bg-white border-accent-200 hover:border-accent-300 hover:bg-accent-50"
              >
                <Filter className="w-4 h-4" />
                {t('programs.filters', 'الفلترة')}
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
                className="flex items-center gap-2 bg-white border-accent-200 hover:border-accent-300 hover:bg-accent-50"
              >
                <Download className="w-4 h-4" />
                {t('programs.export', 'تصدير')}
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
              className="mt-4 pt-4 border-t border-accent-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('programs.filters.status', 'الحالة')}
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 bg-white"
                  >
                    <option value="all">
                      {t('programs.filters.allStatus', 'جميع الحالات')}
                    </option>
                    <option value="active">
                      {t('programs.filters.active', 'نشط')}
                    </option>
                    <option value="completed">
                      {t('programs.filters.completed', 'مكتمل')}
                    </option>
                    <option value="paused">
                      {t('programs.filters.paused', 'متوقف مؤقتاً')}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('programs.filters.category', 'الفئة')}
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 bg-white"
                  >
                    <option value="all">
                      {t('programs.filters.allCategories', 'جميع الفئات')}
                    </option>
                    <option value="صحية">
                      {t('programs.filters.health', 'صحية')}
                    </option>
                    <option value="تعليمية">
                      {t('programs.filters.educational', 'تعليمية')}
                    </option>
                    <option value="اجتماعية">
                      {t('programs.filters.social', 'اجتماعية')}
                    </option>
                    <option value="رياضية">
                      {t('programs.filters.sports', 'رياضية')}
                    </option>
                    <option value="ثقافية">
                      {t('programs.filters.cultural', 'ثقافية')}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('programs.filters.sort', 'ترتيب حسب')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 bg-white"
                  >
                    <option value="date">
                      {t('programs.filters.sortByDate', 'التاريخ')}
                    </option>
                    <option value="title">
                      {t('programs.filters.sortByTitle', 'العنوان')}
                    </option>
                    <option value="category">
                      {t('programs.filters.sortByCategory', 'الفئة')}
                    </option>
                    <option value="status">
                      {t('programs.filters.sortByStatus', 'الحالة')}
                    </option>
                    <option value="amount">
                      {t('programs.filters.sortByAmount', 'المبلغ')}
                    </option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Programs Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {program.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {program.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/dashboard/programs/${program.id}`)
                        }
                        className="p-1"
                        title={t('programs.actions.view', 'عرض التفاصيل')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal('edit', program)}
                        className="p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(program.id)}
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
                        {formatDate(program.start_date)} -{' '}
                        {formatDate(program.end_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {program.participants_count}{' '}
                        {t('programs.participants', 'مشارك')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {t('programs.funding', 'التمويل')}
                        </span>
                        <span className="font-medium">
                          ₺{(program.current_amount || 0).toLocaleString()} / ₺
                          {(program.goal_amount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${getProgressPercentage(
                              program.current_amount,
                              program.goal_amount
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        {getProgressPercentage(
                          program.current_amount,
                          program.goal_amount
                        ).toFixed(1)}
                        %
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          program.status
                        )}`}
                      >
                        {getStatusText(program.status)}
                      </span>
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
            ? t('programs.modal.addTitle', 'إضافة برنامج جديد')
            : modalType === 'edit'
            ? t('programs.modal.editTitle', 'تعديل البرنامج')
            : t('programs.modal.viewTitle', 'تفاصيل البرنامج')
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('programs.form.title', 'عنوان البرنامج')} *
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
                {t('programs.form.category', 'الفئة')} *
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
                  {t('programs.form.selectCategory', 'اختر الفئة')}
                </option>
                <option value="صحية">
                  {t('programs.categories.health', 'صحية')}
                </option>
                <option value="تقنية">
                  {t('programs.categories.tech', 'تقنية')}
                </option>
                <option value="قيادية">
                  {t('programs.categories.leadership', 'قيادية')}
                </option>
                <option value="تطوعية">
                  {t('programs.categories.volunteer', 'تطوعية')}
                </option>
                <option value="أعمال">
                  {t('programs.categories.business', 'أعمال')}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('programs.form.description', 'وصف البرنامج')} *
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('programs.form.goalAmount', 'المبلغ المطلوب')} *
              </label>
              <Input
                type="number"
                name="goal_amount"
                value={form.goal_amount}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
                min="1"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('programs.form.startDate', 'تاريخ البداية')} *
              </label>
              <Input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('programs.form.endDate', 'تاريخ النهاية')} *
              </label>
              <Input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('programs.form.image', 'صورة البرنامج')}
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
                  ? t('programs.form.add', 'إضافة')
                  : t('programs.form.update', 'تحديث')}
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default ProgramsDashboard;
