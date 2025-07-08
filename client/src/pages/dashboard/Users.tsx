import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, deleteUser } from '../../services/dashboardApi';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  AccessibleSection,
  SkipToContent,
} from '../../components/common/AccessibleComponents';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
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
} from 'lucide-react';
import QuickActions from '../../components/common/QuickActions';
import { Link } from 'react-router-dom';

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
  // جلب قائمة المستخدمين
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: () => fetchUsers(),
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

  // بيانات افتراضية للمستخدمين
  const mockUsers: User[] = [
    {
      id: '1',
      firstName: 'أحمد',
      lastName: 'محمد',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      role: 'admin',
      status: 'active',
      avatar: 'AM',
      joinDate: '2024-01-15',
      lastLogin: '2024-06-01T10:30:00Z',
      location: 'الرياض، السعودية',
      bio: 'مدير المنظمة ومؤسسها',
      eventsAttended: 25,
      programsParticipated: 8,
      totalDonations: 5000,
      isVerified: true,
      permissions: ['all'],
    },
    {
      id: '2',
      firstName: 'فاطمة',
      lastName: 'علي',
      email: 'fatima@example.com',
      phone: '+966502345678',
      role: 'moderator',
      status: 'active',
      avatar: 'فع',
      joinDate: '2024-02-01',
      lastLogin: '2024-06-01T09:15:00Z',
      location: 'جدة، السعودية',
      bio: 'منسقة الفعاليات والبرامج',
      eventsAttended: 18,
      programsParticipated: 6,
      totalDonations: 2500,
      isVerified: true,
      permissions: ['events', 'programs', 'users'],
    },
    {
      id: '3',
      firstName: 'عمر',
      lastName: 'خالد',
      email: 'omar@example.com',
      phone: '+966503456789',
      role: 'member',
      status: 'active',
      avatar: 'عخ',
      joinDate: '2024-03-10',
      lastLogin: '2024-05-30T14:20:00Z',
      location: 'الدمام، السعودية',
      bio: 'عضو نشط في المنظمة',
      eventsAttended: 12,
      programsParticipated: 4,
      totalDonations: 1200,
      isVerified: true,
      permissions: ['events', 'programs'],
    },
    {
      id: '4',
      firstName: 'سارة',
      lastName: 'أحمد',
      email: 'sara@example.com',
      phone: '+966504567890',
      role: 'member',
      status: 'pending',
      avatar: 'سأ',
      joinDate: '2024-06-01',
      lastLogin: '2024-06-01T08:45:00Z',
      location: 'مكة، السعودية',
      bio: 'عضو جديد في المنظمة',
      eventsAttended: 0,
      programsParticipated: 0,
      totalDonations: 0,
      isVerified: false,
      permissions: ['events'],
    },
    {
      id: '5',
      firstName: 'يوسف',
      lastName: 'عبدالله',
      email: 'youssef@example.com',
      phone: '+966505678901',
      role: 'guest',
      status: 'inactive',
      avatar: 'يع',
      joinDate: '2024-04-20',
      lastLogin: '2024-05-15T16:30:00Z',
      location: 'المدينة، السعودية',
      bio: 'زائر في المنظمة',
      eventsAttended: 3,
      programsParticipated: 1,
      totalDonations: 300,
      isVerified: false,
      permissions: ['events'],
    },
  ];

  const users = data?.data?.items || mockUsers;

  // فلترة المستخدمين
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleOpenModal = (type: 'add' | 'edit' | 'view', user?: User) => {
    setModalType(type);
    setFormError('');

    if (type === 'add') {
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
      setSelectedUser(null);
    } else if (user) {
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
    }

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      setFormError('الحقول الأساسية مطلوبة');
      return;
    }
    if (
      modalType === 'add' &&
      (!form.password || form.password !== form.confirmPassword)
    ) {
      setFormError('كلمة المرور غير متطابقة');
      return;
    }

    // محاكاة عملية الإضافة/التعديل
    if (modalType === 'add') {
      console.log('إضافة مستخدم جديد:', form);
      // هنا سيتم إرسال البيانات إلى API
      setModalMsg('تم إضافة المستخدم بنجاح!');
    } else if (modalType === 'edit' && selectedUser) {
      console.log('تعديل المستخدم:', { id: selectedUser.id, ...form });
      // هنا سيتم إرسال البيانات إلى API
      setModalMsg('تم تحديث المستخدم بنجاح!');
    }

    setModalOpen(false);
    // إعادة تحميل البيانات
    // queryClient.invalidateQueries(['dashboard-users']);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'guest':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مدير';
      case 'moderator':
        return 'مشرف';
      case 'member':
        return 'عضو';
      case 'guest':
        return 'زائر';
      default:
        return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'pending':
        return 'قيد الانتظار';
      case 'suspended':
        return 'معلق';
      default:
        return 'غير محدد';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'الآن';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInHours < 48) return 'أمس';
    return formatDate(dateString);
  };

  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        await deleteUser(id);
        setModalMsg('تم حذف المستخدم بنجاح!');
        setModalOpen(true);
        // إعادة تحميل البيانات
        queryClient.invalidateQueries({ queryKey: ['dashboard-users'] });
      } catch (error) {
        console.error('خطأ في حذف المستخدم:', error);
        setFormError('حدث خطأ أثناء حذف المستخدم');
      }
    }
  };

  const quickActions = [
    {
      to: '/dashboard/events/new',
      label: 'إضافة فعالية',
      icon: Plus,
      color: 'primary' as const,
      description: 'إنشاء فعالية جديدة',
    },
    {
      to: '/dashboard/programs/new',
      label: 'إضافة برنامج',
      icon: TrendingUp,
      color: 'success' as const,
      description: 'إنشاء برنامج جديد',
    },
    {
      to: '/dashboard/donations/new',
      label: 'تسجيل تبرع',
      icon: DollarSign,
      color: 'warning' as const,
      description: 'تسجيل تبرع جديد',
    },
    {
      to: '/dashboard/users/new',
      label: 'إضافة عضو',
      icon: Users,
      color: 'info' as const,
      description: 'إضافة عضو جديد',
    },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <QuickActions actions={quickActions} className="mb-8" />
        <SkipToContent />
        <AccessibleSection>
          <Alert type="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء جلب قائمة المستخدمين. يرجى المحاولة مرة أخرى.
          </Alert>
        </AccessibleSection>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <QuickActions actions={quickActions} className="mb-8" />
      <SkipToContent />

      <AccessibleSection>
        <div className="max-w-7xl mx-auto py-6 px-2 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                إدارة المستخدمين
              </h1>
              <p className="text-gray-600">إدارة أعضاء المنظمة وصلاحياتهم</p>
            </div>
            <Link to="/dashboard/users/new">
              <Button icon={UserPlus}>إضافة عضو</Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="البحث في المستخدمين..."
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
                    setStatusFilter('all');
                    setRoleFilter('all');
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
                      الحالة
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                      <option value="pending">قيد الانتظار</option>
                      <option value="suspended">معلق</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الدور
                    </label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الأدوار</option>
                      <option value="admin">مدير</option>
                      <option value="moderator">مشرف</option>
                      <option value="member">عضو</option>
                      <option value="guest">زائر</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الترتيب
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="newest">الأحدث</option>
                      <option value="oldest">الأقدم</option>
                      <option value="name">الاسم</option>
                      <option value="activity">النشاط</option>
                      <option value="role">الدور</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Users Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user: any) => (
                <Card
                  key={user.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                          {user.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`خيارات مستخدم ${user.firstName} ${user.lastName}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status and Role Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleText(user.role)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {getStatusText(user.status)}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        <span>انضم {formatDate(user.joinDate)}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="flex items-center justify-center text-primary-600 mb-1">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.eventsAttended}
                        </div>
                        <div className="text-xs text-gray-500">فعالية</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center text-green-600 mb-1">
                          <Star className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.programsParticipated}
                        </div>
                        <div className="text-xs text-gray-500">برنامج</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center text-blue-600 mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${user.totalDonations}
                        </div>
                        <div className="text-xs text-gray-500">تبرع</div>
                      </div>
                    </div>

                    {/* Verification Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {user.isVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400 mr-1" />
                        )}
                        <span className="text-xs text-gray-600">
                          {user.isVerified ? 'موثق' : 'غير موثق'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatLastLogin(user.lastLogin)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal('view', user)}
                        icon={Eye}
                        className="flex-1"
                      >
                        عرض
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal('edit', user)}
                        icon={Edit}
                        className="flex-1"
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user.id)}
                        icon={Trash2}
                        className="text-red-600 hover:text-red-700"
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredUsers.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد مستخدمين
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                  ? 'لا توجد مستخدمين تطابق معايير البحث المحددة'
                  : 'ابدأ بإضافة مستخدم جديد'}
              </p>
              <Link to="/dashboard/users/new">
                <Button icon={UserPlus}>إضافة عضو</Button>
              </Link>
            </Card>
          )}

          {/* Modal */}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'add'
                ? 'إضافة مستخدم جديد'
                : modalType === 'edit'
                ? 'تعديل المستخدم'
                : 'تفاصيل المستخدم'
            }
          >
            {modalType === 'view' && selectedUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الدور
                    </label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        selectedUser.role
                      )}`}
                    >
                      {getRoleText(selectedUser.role)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الحالة
                    </label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedUser.status
                      )}`}
                    >
                      {getStatusText(selectedUser.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف
                    </label>
                    <p className="text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الموقع
                    </label>
                    <p className="text-gray-900">{selectedUser.location}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    السيرة الذاتية
                  </label>
                  <p className="text-gray-900">{selectedUser.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الانضمام
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedUser.joinDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آخر تسجيل دخول
                    </label>
                    <p className="text-gray-900">
                      {formatLastLogin(selectedUser.lastLogin)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {selectedUser.eventsAttended}
                    </div>
                    <div className="text-xs text-gray-600">فعالية</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {selectedUser.programsParticipated}
                    </div>
                    <div className="text-xs text-gray-600">برنامج</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">
                      ${selectedUser.totalDonations}
                    </div>
                    <div className="text-xs text-gray-600">تبرع</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleOpenModal('edit', selectedUser)}
                    className="flex-1"
                  >
                    تعديل المستخدم
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    إغلاق
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <Alert type="error" className="mb-4">
                    {formError}
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      الاسم الأول
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      placeholder="الاسم الأول"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      الاسم الأخير
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      placeholder="الاسم الأخير"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      البريد الإلكتروني
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      رقم الهاتف
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+966501234567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      الدور
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">اختر الدور</option>
                      <option value="admin">مدير</option>
                      <option value="moderator">مشرف</option>
                      <option value="member">عضو</option>
                      <option value="guest">زائر</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      الحالة
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">اختر الحالة</option>
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                      <option value="pending">قيد الانتظار</option>
                      <option value="suspended">معلق</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الموقع
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="المدينة، البلد"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    السيرة الذاتية
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="نبذة مختصرة عن المستخدم"
                  />
                </div>

                {modalType === 'add' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        كلمة المرور
                      </label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        placeholder="كلمة المرور"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        تأكيد كلمة المرور
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="تأكيد كلمة المرور"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {modalType === 'add' ? 'إضافة المستخدم' : 'حفظ التغييرات'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            )}
          </Modal>
        </div>
      </AccessibleSection>
    </DashboardLayout>
  );
};

export default UsersDashboard;
