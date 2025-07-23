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
        <section className="py-8 px-4" dir="rtl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-primary-700">
              إدارة البرامج
            </h1>
            <Button onClick={() => handleOpenModal('add')}>
              إضافة برنامج جديد
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Alert type="error">
              حدث خطأ أثناء جلب البرامج. يرجى المحاولة لاحقًا.
            </Alert>
          ) : filteredPrograms.length === 0 ? (
            <Alert type="info">لا توجد برامج متاحة حالياً.</Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="flex flex-col gap-2">
                  {program.image_url && (
                    <img
                      src={program.image_url}
                      alt={program.title}
                      className="w-full h-40 object-cover rounded-t-lg mb-2"
                      loading="lazy"
                    />
                  )}
                  <div className="flex flex-col gap-1 p-2">
                    <h2 className="text-lg font-bold text-primary-700 mb-1 line-clamp-2">
                      {program.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span>{program.category}</span>
                      <span>•</span>
                      <span>
                        {program.start_date} - {program.end_date}
                      </span>
                      <span>•</span>
                      <span>
                        {program.status === 'active'
                          ? 'نشط'
                          : program.status === 'completed'
                          ? 'مكتمل'
                          : program.status === 'pending'
                          ? 'قيد الانتظار'
                          : 'ملغي'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2 line-clamp-3">
                      {program.description?.slice(0, 100) || ''}
                      {program.description?.length > 100 ? '...' : ''}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenModal('view', program)}
                      >
                        عرض
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenModal('edit', program)}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        color="red"
                        onClick={() => handleDelete(program.id)}
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
                ? 'إضافة برنامج'
                : modalType === 'edit'
                ? 'تعديل برنامج'
                : 'تفاصيل البرنامج'
            }
          >
            {modalType === 'view' && selectedProgram ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-primary-700">
                  {selectedProgram.title}
                </h2>
                <div className="text-gray-600">
                  {selectedProgram.description}
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div>الفئة: {selectedProgram.category}</div>
                  <div>
                    التاريخ: {selectedProgram.start_date} -{' '}
                    {selectedProgram.end_date}
                  </div>
                  <div>الحالة: {getStatusText(selectedProgram.status)}</div>
                  <div>الهدف المالي: {selectedProgram.goal_amount}</div>
                  <div>المبلغ الحالي: {selectedProgram.current_amount}</div>
                  <div>عدد المشاركين: {selectedProgram.participants_count}</div>
                </div>
                {selectedProgram.image_url && (
                  <img
                    src={selectedProgram.image_url}
                    alt="صورة البرنامج"
                    className="w-full h-40 object-cover rounded"
                  />
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleOpenModal('edit', selectedProgram)}
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
                  name="title"
                  placeholder="اسم البرنامج"
                  className="w-full border rounded p-2"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="category"
                  placeholder="الفئة"
                  className="w-full border rounded p-2"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="goal_amount"
                  placeholder="الهدف المالي (بالريال)"
                  className="w-full border rounded p-2"
                  value={form.goal_amount}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="start_date"
                  placeholder="تاريخ البداية"
                  className="w-full border rounded p-2"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="end_date"
                  placeholder="تاريخ النهاية"
                  className="w-full border rounded p-2"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="وصف البرنامج"
                  className="w-full border rounded p-2 min-h-[100px]"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <div>
                  <label className="block mb-1">صورة البرنامج (اختياري)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="relative mt-2 w-32 h-20">
                      <img
                        src={imagePreview}
                        alt="معاينة"
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
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

export default ProgramsDashboard;
