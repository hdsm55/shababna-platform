import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchEvents,
  createEvent,
  updateEvent,
} from '../../services/eventsApi';
import { deleteEvent } from '../../services/dashboardApi';
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
} from 'lucide-react';
import QuickActions from '../../components/common/QuickActions';
import { Link, useNavigate } from 'react-router-dom';

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
  // جلب قائمة الفعاليات
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: () => fetchEvents(),
  });

  // طباعة البيانات في الكونسول للتشخيص
  console.log('dashboard-events data:', data);

  // حالة النافذة المنبثقة
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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

  // بيانات افتراضية للفعاليات
  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'ملتقى الشباب العربي',
      description:
        'ملتقى سنوي يجمع الشباب العربي لمناقشة قضاياهم وتطوير مهاراتهم',
      category: 'اجتماعي',
      location: 'القاهرة، مصر',
      start_date: '2024-07-15',
      end_date: '2024-07-17',
      status: 'upcoming',
      max_attendees: 200,
      attendees: 150,
      image_url: 'https://via.placeholder.com/150',
      created_at: '2024-05-01',
      updated_at: '2024-05-15',
    },
    {
      id: 2,
      title: 'ورشة عمل التكنولوجيا',
      description: 'ورشة عمل مكثفة في مجال التكنولوجيا والبرمجة للشباب',
      category: 'تعليمي',
      location: 'الرياض، السعودية',
      start_date: '2024-06-20',
      end_date: '2024-06-22',
      status: 'active',
      max_attendees: 50,
      attendees: 45,
      image_url: 'https://via.placeholder.com/150',
      created_at: '2024-04-15',
      updated_at: '2024-06-01',
    },
    {
      id: 3,
      title: 'مؤتمر القيادة الشبابية',
      description: 'مؤتمر سنوي لتطوير مهارات القيادة لدى الشباب',
      category: 'قيادي',
      location: 'دبي، الإمارات',
      start_date: '2024-08-10',
      end_date: '2024-08-12',
      status: 'upcoming',
      max_attendees: 300,
      attendees: 120,
      image_url: 'https://via.placeholder.com/150',
      created_at: '2024-06-01',
      updated_at: '2024-06-01',
    },
    {
      id: 4,
      title: 'معرض الفنون الشبابية',
      description: 'معرض سنوي لعرض إبداعات الشباب في مجال الفنون',
      category: 'ثقافي',
      location: 'عمان، الأردن',
      start_date: '2024-05-01',
      end_date: '2024-05-03',
      status: 'completed',
      max_attendees: 100,
      attendees: 95,
      image_url: 'https://via.placeholder.com/150',
      created_at: '2024-03-01',
      updated_at: '2024-05-03',
    },
  ];

  const events = data?.data?.items || [];

  // فلترة الفعاليات
  const filteredEvents = events.filter((event: any) => {
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

  const handleOpenModal = (type: 'add' | 'edit' | 'view', event?: Event) => {
    setModalType(type);
    setFormError('');
    setImage(null);
    setImagePreview(null);

    if (type === 'add') {
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
      setSelectedEvent(null);
    } else if (event) {
      setSelectedEvent(event);
      setForm({
        title: event.title,
        description: event.description,
        category: event.category,
        location: event.location,
        start_date: event.start_date,
        end_date: event.end_date,
        max_attendees: event.max_attendees?.toString() || '',
        attendees: event.attendees?.toString() || '',
        image_url: event.image_url || '',
        status: event.status,
      });
      if (event.image_url) {
        setImagePreview(event.image_url);
      }
    }

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
    setFormError('');
    setModalMsg('');

    // تحقق من الحقول المطلوبة
    if (
      !form.title ||
      !form.start_date ||
      !form.end_date ||
      !form.category ||
      !form.status
    ) {
      setFormError(
        'جميع الحقول الأساسية مطلوبة. يرجى تعبئة جميع الحقول بشكل صحيح.'
      );
      return;
    }

    // تحقق من صحة التواريخ
    if (new Date(form.end_date) < new Date(form.start_date)) {
      setFormError('تاريخ النهاية يجب أن يكون بعد تاريخ البداية.');
      return;
    }

    // بناء الـ payload مع تحويل القيم الرقمية
    const allowedStatuses = [
      'upcoming',
      'active',
      'completed',
      'cancelled',
    ] as const;
    const payload = {
      ...form,
      max_attendees:
        form.max_attendees && !isNaN(Number(form.max_attendees))
          ? Number(form.max_attendees)
          : undefined,
      attendees:
        form.attendees && !isNaN(Number(form.attendees))
          ? Number(form.attendees)
          : 0,
      status: allowedStatuses.includes(form.status as any)
        ? (form.status as (typeof allowedStatuses)[number])
        : 'upcoming',
      image_url:
        form.image_url && form.image_url.trim() !== ''
          ? form.image_url
          : undefined,
    };

    try {
      if (modalType === 'add') {
        await createEvent(payload);
        setModalMsg('تم إضافة الفعالية بنجاح!');
      } else if (modalType === 'edit' && selectedEvent) {
        await updateEvent(Number(selectedEvent.id), payload);
        setModalMsg('تم تحديث الفعالية بنجاح!');
      }

      setTimeout(() => {
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['dashboard-events'] });
      }, 1500);
    } catch (error) {
      setFormError('حدث خطأ أثناء حفظ الفعالية');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'قادم';
      case 'active':
        return 'نشط';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  const getRegistrationPercentage = (registered: number, capacity: number) => {
    return Math.min((registered / capacity) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // دالة التعامل مع الأزرار غير الفعالة
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
      try {
        await deleteEvent(id);
        setModalMsg('تم حذف الفعالية بنجاح!');
        setModalOpen(true);
        // إعادة تحميل البيانات
        queryClient.invalidateQueries({ queryKey: ['dashboard-events'] });
      } catch (error) {
        console.error('خطأ في حذف الفعالية:', error);
        setFormError('حدث خطأ أثناء حذف الفعالية');
      }
    }
  };

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <Alert type="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء جلب قائمة الفعاليات. يرجى المحاولة مرة أخرى.
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="py-8 px-4" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary-700">
            إدارة الفعاليات
          </h1>
          <Button onClick={() => handleOpenModal('add')}>
            إضافة فعالية جديدة
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Alert type="error">
            حدث خطأ أثناء جلب الفعاليات. يرجى المحاولة لاحقًا.
          </Alert>
        ) : filteredEvents.length === 0 ? (
          <Alert type="info">لا توجد فعاليات متاحة حالياً.</Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="flex flex-col gap-2">
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-t-lg mb-2"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-col gap-1 p-2">
                  <h2 className="text-lg font-bold text-primary-700 mb-1 line-clamp-2">
                    {event.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>{event.category}</span>
                    <span>•</span>
                    <span>{event.location}</span>
                    <span>•</span>
                    <span>
                      {event.start_date} - {event.end_date}
                    </span>
                    <span>•</span>
                    <span>
                      {event.status === 'active'
                        ? 'نشطة'
                        : event.status === 'completed'
                        ? 'مكتملة'
                        : event.status === 'pending'
                        ? 'قيد الانتظار'
                        : 'قادمة'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2 line-clamp-3">
                    {event.description?.slice(0, 100) || ''}
                    {event.description?.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenModal('view', event)}
                    >
                      عرض
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/dashboard/events/${event.id}/edit`)
                      }
                    >
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      color="red"
                      onClick={() => handleDelete(event.id)}
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
              ? 'إضافة فعالية'
              : modalType === 'edit'
              ? 'تعديل فعالية'
              : 'تفاصيل الفعالية'
          }
        >
          {modalType === 'view' && selectedEvent ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary-700">
                {selectedEvent.title}
              </h2>
              <div className="text-gray-600">{selectedEvent.description}</div>
              <div className="flex flex-col gap-2 text-sm">
                <div>الفئة: {selectedEvent.category}</div>
                <div>الموقع: {selectedEvent.location}</div>
                <div>
                  التاريخ: {selectedEvent.start_date} - {selectedEvent.end_date}
                </div>
                <div>الحالة: {getStatusText(selectedEvent.status)}</div>
                <div>الحد الأقصى للحضور: {selectedEvent.max_attendees}</div>
                <div>الحضور الحالي: {selectedEvent.attendees}</div>
              </div>
              {selectedEvent.image_url && (
                <img
                  src={selectedEvent.image_url}
                  alt="صورة الفعالية"
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleOpenModal('edit', selectedEvent)}
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
                placeholder="اسم الفعالية"
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
                type="text"
                name="location"
                placeholder="الموقع"
                className="w-full border rounded p-2"
                value={form.location}
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
              <input
                type="number"
                name="max_attendees"
                placeholder="الحد الأقصى للحضور"
                className="w-full border rounded p-2"
                value={form.max_attendees}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="وصف الفعالية"
                className="w-full border rounded p-2 min-h-[100px]"
                value={form.description}
                onChange={handleChange}
                required
              />
              <div>
                <label className="block mb-1">صورة الفعالية (اختياري)</label>
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
    </DashboardLayout>
  );
};

export default EventsDashboard;
