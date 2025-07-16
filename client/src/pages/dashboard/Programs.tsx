import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchPrograms,
  createProgram,
  updateProgram,
} from '../../services/programsApi';
import { deleteProgram } from '../../services/dashboardApi';
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
} from 'lucide-react';
import QuickActions from '../../components/common/QuickActions';
import { Link } from 'react-router-dom';

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
  // جلب قائمة البرامج
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-programs'],
    queryFn: () => fetchPrograms(),
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

  // بيانات افتراضية للبرامج
  const mockPrograms: Program[] = [
    {
      id: '1',
      title: 'برنامج التوعية الصحية',
      description: 'برنامج شامل للتوعية الصحية للشباب',
      category: 'صحية',
      goal_amount: 5000,
      current_amount: 3200,
      status: 'active',
      start_date: '2024-06-01',
      end_date: '2024-08-01',
      participants_count: 45,
      created_at: '2024-05-15',
      updated_at: '2024-05-20',
      image_url: '/default-program.png',
    },
    {
      id: '2',
      title: 'مشروع التعليم الرقمي',
      description: 'تطوير مهارات الشباب في التكنولوجيا',
      category: 'تعليمية',
      goal_amount: 8000,
      current_amount: 8000,
      status: 'completed',
      start_date: '2024-03-01',
      end_date: '2024-05-01',
      participants_count: 32,
      created_at: '2024-02-15',
      updated_at: '2024-05-01',
      image_url: '/default-program.png',
    },
    {
      id: '3',
      title: 'برنامج القيادة الشبابية',
      description: 'تطوير مهارات القيادة للشباب',
      category: 'قيادية',
      goal_amount: 3000,
      current_amount: 1500,
      status: 'pending',
      start_date: '2024-07-01',
      end_date: '2024-09-01',
      participants_count: 25,
      created_at: '2024-06-01',
      updated_at: '2024-06-01',
      image_url: '/default-program.png',
    },
  ];

  const programs = data?.data?.items || mockPrograms;

  // فلترة البرامج
  const filteredPrograms = programs.filter((program: any) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || program.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || program.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenModal = (
    type: 'add' | 'edit' | 'view',
    program?: Program
  ) => {
    setModalType(type);
    setFormError('');
    setImage(null);
    setImagePreview(null);

    if (type === 'add') {
      setForm({
        title: '',
        description: '',
        category: '',
        goal_amount: '',
        start_date: '',
        end_date: '',
      });
      setSelectedProgram(null);
    } else if (program) {
      setSelectedProgram(program);
      setForm({
        title: program.title,
        description: program.description,
        category: program.category,
        goal_amount: program.goal_amount.toString(),
        start_date: program.start_date,
        end_date: program.end_date,
      });
      if (program.image_url) {
        setImagePreview(program.image_url);
      }
    }

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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.description ||
      !form.category ||
      !form.goal_amount ||
      !form.start_date ||
      !form.end_date
    ) {
      setFormError('جميع الحقول المطلوبة يجب ملؤها');
      return;
    }

    setFormError('');
    setModalMsg('');

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('goal_amount', form.goal_amount);
      formData.append('start_date', form.start_date);
      formData.append('end_date', form.end_date);

      if (image) {
        formData.append('image', image);
      }

      if (modalType === 'add') {
        await createProgram(formData);
        setModalMsg('تم إضافة البرنامج بنجاح!');
      } else if (modalType === 'edit' && selectedProgram) {
        await updateProgram(selectedProgram.id, formData);
        setModalMsg('تم تحديث البرنامج بنجاح!');
      }

      setTimeout(() => {
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['dashboard-programs'] });
      }, 1500);
    } catch (error) {
      setFormError('حدث خطأ أثناء حفظ البرنامج');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البرنامج؟')) {
      try {
        await deleteProgram(id);
        setModalMsg('تم حذف البرنامج بنجاح!');
        setModalOpen(true);
        // إعادة تحميل البيانات
        queryClient.invalidateQueries({ queryKey: ['dashboard-programs'] });
      } catch (error) {
        console.error('خطأ في حذف البرنامج:', error);
        setFormError('حدث خطأ أثناء حذف البرنامج');
      }
    }
  };

  // دالة التعامل مع الأزرار غير الفعالة
  const handleUnavailable = (msg = 'هذه الخاصية قيد التطوير، قريبًا!') => {
    setModalMsg(msg);
    setModalOpen(true);
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
            حدث خطأ أثناء جلب قائمة البرامج. يرجى المحاولة مرة أخرى.
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">إدارة البرامج</h1>
            <Link to="/programs">
              <Button
                variant="outline"
                className="font-bold text-primary-600 border-primary-300"
              >
                عرض جميع البرامج
              </Button>
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
                    placeholder="البحث في البرامج..."
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
                    setCategoryFilter('all');
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
                      <option value="completed">مكتمل</option>
                      <option value="pending">قيد الانتظار</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الفئة
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الفئات</option>
                      <option value="صحية">صحية</option>
                      <option value="تعليمية">تعليمية</option>
                      <option value="قيادية">قيادية</option>
                      <option value="اجتماعية">اجتماعية</option>
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
                      <option value="progress">التقدم</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Programs Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program: any) => (
                <Card
                  key={program.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  {program.image_url && (
                    <img
                      src={program.image_url}
                      alt={program.title}
                      className="w-full h-40 object-cover rounded-t-lg mb-4"
                      onError={(e) => {
                        e.currentTarget.src = '/default-program.png';
                      }} // صورة افتراضية إذا لم تظهر الصورة
                    />
                  )}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {program.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {program.description}
                        </p>
                      </div>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`خيارات برنامج ${program.title}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          program.status
                        )}`}
                      >
                        {getStatusText(program.status)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {program.category}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">التقدم</span>
                        <span className="font-medium">
                          $
                          {typeof program.current_amount === 'number'
                            ? program.current_amount.toLocaleString()
                            : '0'}{' '}
                          / $
                          {typeof program.goal_amount === 'number'
                            ? program.goal_amount.toLocaleString()
                            : '0'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getProgressPercentage(
                              program.current_amount,
                              program.goal_amount
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getProgressPercentage(
                          program.current_amount,
                          program.goal_amount
                        ).toFixed(1)}
                        % مكتمل
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="flex items-center justify-center text-primary-600 mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {program.participants_count}
                        </div>
                        <div className="text-xs text-gray-500">مشارك</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center text-green-600 mb-1">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(program.start_date).toLocaleDateString(
                            'ar-SA'
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          تاريخ البداية
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center text-blue-600 mb-1">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          $
                          {typeof program.current_amount === 'number'
                            ? program.current_amount.toLocaleString()
                            : '0'}
                        </div>
                        <div className="text-xs text-gray-500">
                          المبلغ الحالي
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal('view', program)}
                        icon={Eye}
                        className="flex-1"
                      >
                        عرض
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal('edit', program)}
                        icon={Edit}
                        className="flex-1"
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(program.id)}
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
          {filteredPrograms.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد برامج
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ||
                statusFilter !== 'all' ||
                categoryFilter !== 'all'
                  ? 'لا توجد برامج تطابق معايير البحث المحددة'
                  : 'ابدأ بإضافة برنامج جديد'}
              </p>
              <Link to="/dashboard/programs/new">
                <Button icon={Plus}>إضافة برنامج</Button>
              </Link>
            </Card>
          )}

          {/* Modal */}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'add'
                ? 'إضافة برنامج جديد'
                : modalType === 'edit'
                ? 'تعديل البرنامج'
                : 'تفاصيل البرنامج'
            }
          >
            {modalType === 'view' && selectedProgram ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم البرنامج
                  </label>
                  <p className="text-gray-900">{selectedProgram.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <p className="text-gray-900">{selectedProgram.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الفئة
                    </label>
                    <p className="text-gray-900">{selectedProgram.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الحالة
                    </label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedProgram.status
                      )}`}
                    >
                      {getStatusText(selectedProgram.status)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الهدف المالي
                    </label>
                    <p className="text-gray-900">
                      $
                      {typeof selectedProgram.goal_amount === 'number'
                        ? selectedProgram.goal_amount.toLocaleString()
                        : '0'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المبلغ الحالي
                    </label>
                    <p className="text-gray-900">
                      $
                      {typeof selectedProgram.current_amount === 'number'
                        ? selectedProgram.current_amount.toLocaleString()
                        : '0'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ البداية
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedProgram.start_date).toLocaleDateString(
                        'ar-SA'
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الانتهاء
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedProgram.end_date).toLocaleDateString(
                        'ar-SA'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleOpenModal('edit', selectedProgram)}
                    className="flex-1"
                  >
                    تعديل البرنامج
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

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    اسم البرنامج
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسم البرنامج"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الوصف
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="أدخل وصف البرنامج"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      الفئة
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">اختر الفئة</option>
                      <option value="صحية">صحية</option>
                      <option value="تعليمية">تعليمية</option>
                      <option value="قيادية">قيادية</option>
                      <option value="اجتماعية">اجتماعية</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="goal_amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      الهدف المالي
                    </label>
                    <Input
                      id="goal_amount"
                      name="goal_amount"
                      type="number"
                      value={form.goal_amount}
                      onChange={handleChange}
                      required
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="start_date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      تاريخ البداية
                    </label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={form.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="end_date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      تاريخ الانتهاء
                    </label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={form.end_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    صورة البرنامج
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>اختر صورة</span>
                      </label>
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeImage}
                          icon={X}
                        >
                          إزالة
                        </Button>
                      )}
                    </div>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="معاينة الصورة"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      المقاس المفضل: 400×400 بكسل (مربع). الحد الأقصى: 2MB
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {modalType === 'add' ? 'إضافة البرنامج' : 'حفظ التغييرات'}
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

          {/* Modal التنبيه */}
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="تنبيه"
          >
            <div className="text-center py-4">
              <p className="text-gray-700 text-lg font-medium">{modalMsg}</p>
            </div>
          </Modal>
        </div>
      </AccessibleSection>
    </DashboardLayout>
  );
};

export default ProgramsDashboard;
