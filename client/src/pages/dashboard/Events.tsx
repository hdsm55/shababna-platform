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
import { Link } from 'react-router-dom';

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

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
      try {
        await deleteEvent(id);
        setModalMsg('تم حذف الفعالية بنجاح!');
        setModalOpen(true);
        // إعادة تحميل البيانات
        queryClient.invalidateQueries({ queryKey: ['events'] });
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
      {isLoading && (
        <div className="text-center py-8 text-lg text-gray-500">
          جاري تحميل الفعاليات...
        </div>
      )}
      {error && (
        <div className="text-center py-8 text-lg text-red-600">
          حدث خطأ أثناء جلب الفعاليات
        </div>
      )}
      {!isLoading && !error && filteredEvents.length === 0 && (
        <div className="text-center py-8 text-lg text-gray-500">
          لا توجد فعاليات متاحة
        </div>
      )}
      <div className="container mx-auto px-2 md:px-6 py-8">
        {/* Quick Actions */}
        <Card className="mb-10 shadow-lg rounded-2xl p-6 bg-gradient-to-tr from-blue-50 to-white border-0">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 tracking-tight text-center md:text-right">
            إجراءات سريعة
          </h2>
          <QuickActions actions={quickActions} className="mb-0" />
        </Card>

        {/* قائمة الفعاليات */}
        <Card className="shadow-md rounded-2xl p-6 bg-white border-0 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              قائمة الفعاليات
            </h1>
            <Link to="/events">
              <Button
                variant="outline"
                className="font-bold text-primary-600 border-primary-300"
              >
                عرض جميع الفعاليات
              </Button>
            </Link>
          </div>
          {/* جدول الفعاليات */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    اسم الفعالية
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    الوصف
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-400 py-8 text-lg font-semibold"
                    >
                      لا توجد فعاليات حالياً
                    </td>
                  </tr>
                ) : (
                  events.map((event: any) => (
                    <tr
                      key={event.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {event.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {event.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {event.start_date}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            event.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : event.status === 'upcoming'
                              ? 'bg-yellow-100 text-yellow-700'
                              : event.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {event.status === 'active'
                            ? 'نشطة'
                            : event.status === 'upcoming'
                            ? 'قادمة'
                            : event.status === 'completed'
                            ? 'منتهية'
                            : 'غير معروف'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          as={Link}
                          to={`/dashboard/events/${event.id}`}
                          className="rounded-md"
                        >
                          عرض
                        </Button>
                        <Link to={`/dashboard/events/${event.id}/edit`}>
                          <Button variant="outline" size="sm" icon={Edit}>
                            تعديل
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
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
            ? 'إضافة فعالية جديدة'
            : modalType === 'edit'
            ? 'تعديل الفعالية'
            : 'تفاصيل الفعالية'
        }
      >
        {modalType === 'view' && selectedEvent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الفعالية
              </label>
              <p className="text-gray-900">{selectedEvent.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <p className="text-gray-900">{selectedEvent.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الفئة
                </label>
                <p className="text-gray-900">{selectedEvent.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الحالة
                </label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedEvent.status
                  )}`}
                >
                  {getStatusText(selectedEvent.status)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الموقع
                </label>
                <p className="text-gray-900">{selectedEvent.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعة
                </label>
                <p className="text-gray-900">
                  {selectedEvent.max_attendees} شخص
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ البداية
                </label>
                <p className="text-gray-900">
                  {formatDate(selectedEvent.start_date)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الانتهاء
                </label>
                <p className="text-gray-900">
                  {formatDate(selectedEvent.end_date)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المتأهلين
                </label>
                <p className="text-gray-900">{selectedEvent.attendees} شخص</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الصورة
                </label>
                <div className="relative">
                  {selectedEvent.image_url ? (
                    <img
                      src={selectedEvent.image_url}
                      alt="صورة الفعالية"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg border text-gray-500 text-sm">
                      لا يوجد صورة
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => handleOpenModal('edit', selectedEvent)}
                className="flex-1"
              >
                تعديل الفعالية
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
                اسم الفعالية
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="أدخل اسم الفعالية"
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
                placeholder="أدخل وصف الفعالية"
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
                  <option value="conference">مؤتمر</option>
                  <option value="workshop">ورشة عمل</option>
                  <option value="networking">شبكة</option>
                </select>
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
                  required
                  placeholder="أدخل الموقع"
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="max_attendees"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  السعة
                </label>
                <Input
                  id="max_attendees"
                  name="max_attendees"
                  type="number"
                  value={form.max_attendees}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </div>
              <div>
                <label
                  htmlFor="attendees"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  المتأهلين
                </label>
                <Input
                  id="attendees"
                  name="attendees"
                  type="number"
                  value={form.attendees}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </div>
              <div>
                <label
                  htmlFor="image_url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الصورة
                </label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="text"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="رابط صورة الفعالية"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <option value="upcoming">قادم</option>
                  <option value="active">نشط</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                صورة الفعالية
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
                {modalType === 'add' ? 'إضافة الفعالية' : 'حفظ التغييرات'}
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="تنبيه">
        <div className="text-center py-4">
          <p className="text-gray-700 text-lg font-medium">{modalMsg}</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EventsDashboard;
