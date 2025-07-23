import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchUsers,
  deleteUser,
  createUser,
  updateUser,
} from '../../services/dashboardApi';
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
import UsersTable from './Users/UsersTable';

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

  // استخدام البيانات الحقيقية فقط
  const users = data?.data?.items || [];

  // فلترة المستخدمين
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      (user.firstName &&
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName &&
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.location &&
        user.location.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    setFormError('');
    try {
      if (modalType === 'add') {
        await createUser(form);
        setModalMsg('تم إضافة المستخدم بنجاح!');
      } else if (modalType === 'edit' && selectedUser) {
        await updateUser(selectedUser.id, form);
        setModalMsg('تم تحديث المستخدم بنجاح!');
      }
      setTimeout(() => {
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['dashboard-users'] });
      }, 1200);
    } catch (error) {
      setFormError('حدث خطأ أثناء حفظ المستخدم');
    }
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
        <section className="py-8 px-4" dir="rtl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-primary-700">
              إدارة المستخدمين
            </h1>
            <Button onClick={() => handleOpenModal('add')}>
              إضافة مستخدم جديد
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Alert type="error">
              حدث خطأ أثناء جلب المستخدمين. يرجى المحاولة لاحقًا.
            </Alert>
          ) : users.length === 0 ? (
            <Alert type="info">لا يوجد مستخدمون متاحون حالياً.</Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-700">
                      {user.avatar ||
                        (user.firstName ? user.firstName[0] : '') +
                          (user.lastName ? user.lastName[0] : '') ||
                        '?'}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-primary-800 mb-1 line-clamp-1">
                        {user.firstName || ''} {user.lastName || ''}
                      </h2>
                      <div className="text-xs text-gray-500 mb-1">
                        {user.email || ''}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          {user.role === 'admin'
                            ? 'مدير'
                            : user.role === 'moderator'
                            ? 'مشرف'
                            : user.role === 'member'
                            ? 'عضو'
                            : 'زائر'}
                        </span>
                        <span>•</span>
                        <span>
                          {user.status === 'active'
                            ? 'نشط'
                            : user.status === 'inactive'
                            ? 'غير نشط'
                            : user.status === 'pending'
                            ? 'قيد الانتظار'
                            : 'موقوف'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-2">
                    <div className="text-xs text-gray-500 mb-1">
                      {user.location}
                    </div>
                    <p className="text-gray-700 mb-2 line-clamp-2">
                      {user.bio?.slice(0, 60) || ''}
                      {user.bio?.length > 60 ? '...' : ''}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenModal('view', user)}
                      >
                        عرض
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenModal('edit', user)}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        color="red"
                        onClick={() => handleDelete(user.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <Modal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'add'
                ? 'إضافة مستخدم'
                : modalType === 'edit'
                ? 'تعديل مستخدم'
                : 'تفاصيل المستخدم'
            }
          >
            {modalType === 'view' && selectedUser ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-primary-700">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <div className="text-gray-600">{selectedUser.email}</div>
                <div className="flex flex-col gap-2 text-sm">
                  <div>
                    الدور:{' '}
                    {selectedUser.role === 'admin'
                      ? 'مدير'
                      : selectedUser.role === 'moderator'
                      ? 'مشرف'
                      : selectedUser.role === 'member'
                      ? 'عضو'
                      : 'زائر'}
                  </div>
                  <div>
                    الحالة:{' '}
                    {selectedUser.status === 'active'
                      ? 'نشط'
                      : selectedUser.status === 'inactive'
                      ? 'غير نشط'
                      : selectedUser.status === 'pending'
                      ? 'قيد الانتظار'
                      : 'موقوف'}
                  </div>
                  <div>رقم الجوال: {selectedUser.phone}</div>
                  <div>الموقع: {selectedUser.location}</div>
                  <div>نبذة: {selectedUser.bio}</div>
                  <div>تاريخ الانضمام: {selectedUser.joinDate}</div>
                  <div>آخر دخول: {selectedUser.lastLogin}</div>
                  <div>عدد الفعاليات: {selectedUser.eventsAttended}</div>
                  <div>عدد البرامج: {selectedUser.programsParticipated}</div>
                  <div>إجمالي التبرعات: {selectedUser.totalDonations}</div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleOpenModal('edit', selectedUser)}
                    className="flex-1"
                  >
                    تعديل
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
                <input
                  type="text"
                  name="firstName"
                  placeholder="الاسم الأول"
                  className="w-full border rounded p-2"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="اسم العائلة"
                  className="w-full border rounded p-2"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="البريد الإلكتروني"
                  className="w-full border rounded p-2"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="رقم الجوال"
                  className="w-full border rounded p-2"
                  value={form.phone}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="location"
                  placeholder="المدينة/الدولة"
                  className="w-full border rounded p-2"
                  value={form.location}
                  onChange={handleChange}
                />
                <textarea
                  name="bio"
                  placeholder="نبذة عن المستخدم"
                  className="w-full border rounded p-2 min-h-[60px]"
                  value={form.bio}
                  onChange={handleChange}
                />
                <select
                  name="role"
                  className="w-full border rounded p-2"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر الدور</option>
                  <option value="admin">مدير</option>
                  <option value="moderator">مشرف</option>
                  <option value="member">عضو</option>
                  <option value="guest">زائر</option>
                </select>
                <select
                  name="status"
                  className="w-full border rounded p-2"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر الحالة</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="suspended">موقوف</option>
                </select>
                <input
                  type="password"
                  name="password"
                  placeholder="كلمة المرور (للمستخدم الجديد أو التغيير)"
                  className="w-full border rounded p-2"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="تأكيد كلمة المرور"
                  className="w-full border rounded p-2"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {formError && (
                  <div className="text-red-600 text-sm">{formError}</div>
                )}
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {modalType === 'add' ? 'إضافة' : 'حفظ التعديلات'}
                  </Button>
                </div>
              </form>
            )}
          </Modal>
        </section>
      </AccessibleSection>
    </DashboardLayout>
  );
};

export default UsersDashboard;
