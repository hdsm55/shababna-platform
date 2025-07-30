import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchUsers,
  deleteUser,
  createUser,
  updateUser,
} from '../../services/dashboardApi';
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
  Users,
  UserPlus,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Activity,
  TrendingUp,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  RefreshCw,
  Settings,
  UserCheck,
  UserX,
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
  X,
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

import SEO from '../../components/common/SEO';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'moderator' | 'member' | 'guest';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  avatar: string;
  joinDate: string;
  lastLogin: string;
  location: string;
  bio: string;
  eventsAttended: number;
  programsParticipated: number;
  totalDonations: number;
  isVerified: boolean;
  permissions: string[];
}

const UsersDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isRTL = i18n.dir() === 'rtl';

  // جلب قائمة المستخدمين
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: () => fetchUsers(),
    staleTime: 5 * 60 * 1000,
  });

  // حالة النافذة المنبثقة
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');

  // حالة الفلترة والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // نموذج البيانات
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    status: '',
    location: '',
    bio: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [modalMsg, setModalMsg] = useState('');

  // استخدام البيانات الحقيقية من API
  const users = data?.data?.items || [];

  const handleOpenModal = (type: 'add' | 'edit' | 'view', user?: User) => {
    setModalType(type);
    if (user) {
      setSelectedUser(user);
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        location: user.location,
        bio: user.bio,
        password: '',
        confirmPassword: '',
      });
    } else {
      setSelectedUser(null);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        status: '',
        location: '',
        bio: '',
        password: '',
        confirmPassword: '',
      });
    }
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setFormError('');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // التحقق من صحة البيانات
    if (!form.firstName || !form.lastName || !form.email) {
      setFormError(
        t('users.form.requiredFields', 'جميع الحقول المطلوبة يجب ملؤها')
      );
      return;
    }

    if (
      modalType === 'add' &&
      (!form.password || form.password !== form.confirmPassword)
    ) {
      setFormError(t('users.form.passwordMismatch', 'كلمة المرور غير متطابقة'));
      return;
    }

    try {
      if (modalType === 'add') {
        await createUser(form);
        setModalMsg(
          `✅ تم إنشاء المستخدم "${form.firstName} ${form.lastName}" بنجاح! 🎉\n\n` +
            `📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}\n` +
            `📧 البريد الإلكتروني: ${form.email}\n` +
            `👤 الدور: ${getRoleText(form.role)}\n` +
            `📱 الهاتف: ${form.phone || 'غير محدد'}`
        );
      } else if (modalType === 'edit' && selectedUser) {
        await updateUser(selectedUser.id, form);
        setModalMsg(
          `✅ تم تحديث المستخدم "${form.firstName} ${form.lastName}" بنجاح! 🔄\n\n` +
            `📅 آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}\n` +
            `📧 البريد الإلكتروني: ${form.email}\n` +
            `👤 الدور: ${getRoleText(form.role)}\n` +
            `📱 الهاتف: ${form.phone || 'غير محدد'}`
        );
      }

      queryClient.invalidateQueries(['dashboard-users']);
      handleCloseModal();
    } catch (error: any) {
      console.error('❌ خطأ في حفظ المستخدم:', error);
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
        errorMessage = '❌ المستخدم غير موجود\nربما تم حذفه من قبل';
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'moderator':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'member':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'guest':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return t('users.roles.admin', 'مدير');
      case 'moderator':
        return t('users.roles.moderator', 'مشرف');
      case 'member':
        return t('users.roles.member', 'عضو');
      case 'guest':
        return t('users.roles.guest', 'زائر');
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'suspended':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('users.status.active', 'نشط');
      case 'inactive':
        return t('users.status.inactive', 'غير نشط');
      case 'pending':
        return t('users.status.pending', 'قيد الانتظار');
      case 'suspended':
        return t('users.status.suspended', 'معلق');
      default:
        return status;
    }
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

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return t('users.lastLogin.justNow', 'الآن');
    } else if (diffInHours < 24) {
      return t('users.lastLogin.hoursAgo', 'منذ {hours} ساعة', {
        hours: diffInHours,
      });
    } else {
      return formatDate(dateString);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        t('users.delete.confirm', 'هل أنت متأكد من حذف هذا المستخدم؟')
      )
    ) {
      try {
        await deleteUser(id);
        queryClient.invalidateQueries(['dashboard-users']);
        setModalMsg(t('users.success.deleted', 'تم حذف المستخدم بنجاح'));
      } catch (error) {
        setFormError(t('users.error.delete', 'حدث خطأ أثناء حذف المستخدم'));
      }
    }
  };

  const handleUnavailable = (
    msg = t('users.unavailable', 'هذه الخاصية قيد التطوير، قريبًا!')
  ) => {
    alert(msg);
  };

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      (user.firstName?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
        break;
      case 'email':
        aValue = a.email;
        bValue = b.email;
        break;
      case 'role':
        aValue = a.role;
        bValue = b.role;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'joinDate':
        aValue = new Date(a.joinDate).getTime();
        bValue = new Date(b.joinDate).getTime();
        break;
      default:
        aValue = a.firstName;
        bValue = b.firstName;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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
          title={t('users.error.title', 'خطأ في تحميل البيانات')}
          message={t(
            'users.error.message',
            'حدث خطأ أثناء تحميل بيانات المستخدمين'
          )}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO
        title={t('users.seo.title', 'إدارة المستخدمين')}
        description={t(
          'users.seo.description',
          'إدارة المستخدمين والأعضاء في المنصة'
        )}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('users.title', 'إدارة المستخدمين')}
            </h1>
            <p className="text-gray-600">
              {t('users.subtitle', 'إدارة المستخدمين والأعضاء في المنصة')}
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
              {t('users.refresh', 'تحديث')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenModal('add')}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {t('users.addNew', 'إضافة مستخدم')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-blue-600">
                  {t('users.stats.total', 'إجمالي')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {users.length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('users.stats.totalUsers', 'إجمالي المستخدمين')}
              </p>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-50">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-green-600">
                  {t('users.stats.active', 'نشط')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {users.filter((u: User) => u.status === 'active').length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('users.stats.activeUsers', 'المستخدمين النشطين')}
              </p>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-yellow-600">
                  {t('users.stats.pending', 'قيد الانتظار')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {users.filter((u: User) => u.status === 'pending').length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('users.stats.pendingUsers', 'المستخدمين قيد الانتظار')}
              </p>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-red-50">
                <UserX className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-right">
                <span className="text-xs text-red-600">
                  {t('users.stats.inactive', 'غير نشط')}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {users.filter((u: User) => u.status === 'inactive').length}
              </h3>
              <p className="text-sm text-gray-600">
                {t('users.stats.inactiveUsers', 'المستخدمين غير النشطين')}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <Card className="p-6 bg-gradient-to-r from-white to-secondary-50 border-secondary-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t(
                    'users.search.placeholder',
                    'البحث في المستخدمين...'
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-white border-secondary-200 focus:border-secondary-500 focus:ring-secondary-500 shadow-sm"
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
                className="flex items-center gap-2 bg-white border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50"
              >
                <Filter className="w-4 h-4" />
                {t('users.filters', 'الفلترة')}
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
                className="flex items-center gap-2 bg-white border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50"
              >
                <Download className="w-4 h-4" />
                {t('users.export', 'تصدير')}
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
              className="mt-4 pt-4 border-t border-secondary-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.filters.status', 'الحالة')}
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white"
                  >
                    <option value="all">
                      {t('users.filters.allStatus', 'جميع الحالات')}
                    </option>
                    <option value="active">
                      {t('users.filters.active', 'نشط')}
                    </option>
                    <option value="inactive">
                      {t('users.filters.inactive', 'غير نشط')}
                    </option>
                    <option value="suspended">
                      {t('users.filters.suspended', 'معلق')}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.filters.role', 'الدور')}
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white"
                  >
                    <option value="all">
                      {t('users.filters.allRoles', 'جميع الأدوار')}
                    </option>
                    <option value="admin">
                      {t('users.filters.admin', 'مدير')}
                    </option>
                    <option value="user">
                      {t('users.filters.user', 'مستخدم')}
                    </option>
                    <option value="moderator">
                      {t('users.filters.moderator', 'مشرف')}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.filters.sort', 'ترتيب حسب')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white"
                  >
                    <option value="name">
                      {t('users.filters.sortByName', 'الاسم')}
                    </option>
                    <option value="email">
                      {t('users.filters.sortByEmail', 'البريد الإلكتروني')}
                    </option>
                    <option value="role">
                      {t('users.filters.sortByRole', 'الدور')}
                    </option>
                    <option value="status">
                      {t('users.filters.sortByStatus', 'الحالة')}
                    </option>
                    <option value="lastLogin">
                      {t('users.filters.sortByLastLogin', 'آخر تسجيل دخول')}
                    </option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </div>

      {/* Users Table */}
      <div>
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    {t('users.table.user', 'المستخدم')}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    {t('users.table.contact', 'معلومات التواصل')}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    {t('users.table.role', 'الدور')}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    {t('users.table.status', 'الحالة')}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    {t('users.table.activity', 'النشاط')}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    {t('users.table.actions', 'الإجراءات')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {user.firstName?.charAt(0) || ''}
                            {user.lastName?.charAt(0) || ''}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstName || ''} {user.lastName || ''}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(user.joinDate)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {user.email || 'غير محدد'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {user.phone || 'غير محدد'}
                          </span>
                        </div>
                        {user.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {user.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleText(user.role)}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {getStatusText(user.status)}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {user.eventsAttended || 0}{' '}
                            {t('users.activity.events', 'فعالية')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {user.programsParticipated || 0}{' '}
                            {t('users.activity.programs', 'برنامج')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {user.totalDonations || 0}{' '}
                            {t('users.activity.donations', 'تبرع')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal('view', user)}
                          className="p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal('edit', user)}
                          className="p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalType === 'add'
            ? t('users.modal.addTitle', 'إضافة مستخدم جديد')
            : modalType === 'edit'
            ? t('users.modal.editTitle', 'تعديل المستخدم')
            : t('users.modal.viewTitle', 'تفاصيل المستخدم')
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.firstName', 'الاسم الأول')} *
              </label>
              <Input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.lastName', 'الاسم الأخير')} *
              </label>
              <Input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.email', 'البريد الإلكتروني')} *
              </label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={modalType === 'view'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.phone', 'رقم الهاتف')}
              </label>
              <Input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={modalType === 'view'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.role', 'الدور')}
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={modalType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">
                  {t('users.form.selectRole', 'اختر الدور')}
                </option>
                <option value="admin">{t('users.roles.admin', 'مدير')}</option>
                <option value="moderator">
                  {t('users.roles.moderator', 'مشرف')}
                </option>
                <option value="member">{t('users.roles.member', 'عضو')}</option>
                <option value="guest">{t('users.roles.guest', 'زائر')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.status', 'الحالة')}
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={modalType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">
                  {t('users.form.selectStatus', 'اختر الحالة')}
                </option>
                <option value="active">
                  {t('users.status.active', 'نشط')}
                </option>
                <option value="inactive">
                  {t('users.status.inactive', 'غير نشط')}
                </option>
                <option value="pending">
                  {t('users.status.pending', 'قيد الانتظار')}
                </option>
                <option value="suspended">
                  {t('users.status.suspended', 'معلق')}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.location', 'الموقع')}
            </label>
            <Input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={modalType === 'view'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.bio', 'نبذة شخصية')}
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              disabled={modalType === 'view'}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {modalType === 'add' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('users.form.password', 'كلمة المرور')} *
                </label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('users.form.confirmPassword', 'تأكيد كلمة المرور')} *
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {formError && <Alert type="error" title={formError} />}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal}>
              {t('common.cancel', 'إلغاء')}
            </Button>
            {modalType !== 'view' && (
              <Button type="submit" variant="primary">
                {modalType === 'add'
                  ? t('users.form.add', 'إضافة')
                  : t('users.form.update', 'تحديث')}
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
    </DashboardLayout>
  );
};

export default UsersDashboard;
