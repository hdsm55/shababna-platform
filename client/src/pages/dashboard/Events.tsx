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
} from 'lucide-react';
import QuickActions from '../../components/common/QuickActions';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  capacity: number;
  registered_count: number;
  price: number;
  organizer: string;
  created_at: string;
  updated_at: string;
}

const EventsDashboard: React.FC = () => {
  // جلب قائمة الفعاليات
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: () => fetchEvents(),
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

  // نموذج البيانات
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    start_date: '',
    end_date: '',
    capacity: '',
    price: '',
    organizer: '',
  });
  const [formError, setFormError] = useState('');

  // حالة التنبيه
  const [modalMsg, setModalMsg] = useState('');

  // بيانات افتراضية للفعاليات
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'ملتقى الشباب العربي',
      description:
        'ملتقى سنوي يجمع الشباب العربي لمناقشة قضاياهم وتطوير مهاراتهم',
      category: 'اجتماعي',
      location: 'القاهرة، مصر',
      start_date: '2024-07-15',
      end_date: '2024-07-17',
      status: 'upcoming',
      capacity: 200,
      registered_count: 150,
      price: 0,
      organizer: 'جمعية شبابنا',
      created_at: '2024-05-01',
      updated_at: '2024-05-15',
    },
    {
      id: '2',
      title: 'ورشة عمل التكنولوجيا',
      description: 'ورشة عمل مكثفة في مجال التكنولوجيا والبرمجة للشباب',
      category: 'تعليمي',
      location: 'الرياض، السعودية',
      start_date: '2024-06-20',
      end_date: '2024-06-22',
      status: 'active',
      capacity: 50,
      registered_count: 45,
      price: 100,
      organizer: 'مركز التطوير التقني',
      created_at: '2024-04-15',
      updated_at: '2024-06-01',
    },
    {
      id: '3',
      title: 'مؤتمر القيادة الشبابية',
      description: 'مؤتمر سنوي لتطوير مهارات القيادة لدى الشباب',
      category: 'قيادي',
      location: 'دبي، الإمارات',
      start_date: '2024-08-10',
      end_date: '2024-08-12',
      status: 'upcoming',
      capacity: 300,
      registered_count: 120,
      price: 200,
      organizer: 'مؤسسة القيادة',
      created_at: '2024-06-01',
      updated_at: '2024-06-01',
    },
    {
      id: '4',
      title: 'معرض الفنون الشبابية',
      description: 'معرض سنوي لعرض إبداعات الشباب في مجال الفنون',
      category: 'ثقافي',
      location: 'عمان، الأردن',
      start_date: '2024-05-01',
      end_date: '2024-05-03',
      status: 'completed',
      capacity: 100,
      registered_count: 95,
      price: 50,
      organizer: 'جمعية الفنون',
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

    if (type === 'add') {
      setForm({
        title: '',
        description: '',
        category: '',
        location: '',
        start_date: '',
        end_date: '',
        capacity: '',
        price: '',
        organizer: '',
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
        capacity: event.capacity.toString(),
        price: event.price.toString(),
        organizer: event.organizer,
      });
    }

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
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
    if (!form.title || !form.description || !form.category || !form.location) {
      setFormError('جميع الحقول المطلوبة يجب ملؤها');
      return;
    }
    setFormError('');
    setModalMsg('');
    try {
      // معالجة category
      const validCategories = ['conference', 'workshop', 'networking'];
      const categoryValue = validCategories.includes(form.category)
        ? form.category
        : 'conference';
      // معالجة capacity و price
      const capacityValue = Number(form.capacity) || 0;
      const priceValue = Number(form.price) || 0;
      if (modalType === 'add') {
        await createEvent({
          title: form.title,
          description: form.description,
          category: categoryValue,
          location: form.location,
          start_date: form.start_date,
          end_date: form.end_date,
          capacity: capacityValue,
          price: priceValue,
          organizer: form.organizer,
        });
        setModalMsg('تم إضافة الفعالية بنجاح!');
      } else if (modalType === 'edit' && selectedEvent) {
        await updateEvent(selectedEvent.id, {
          title: form.title,
          description: form.description,
          category: categoryValue,
          location: form.location,
          start_date: form.start_date,
          end_date: form.end_date,
          capacity: capacityValue,
          price: priceValue,
          organizer: form.organizer,
        });
        setModalMsg('تم تحديث الفعالية بنجاح!');
      }
      setModalOpen(false);
      queryClient.invalidateQueries(['dashboard-events']);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              قائمة الفعاليات
            </h1>
            <Link to="/dashboard/events/new">
              <Button
                icon={Plus}
                className="font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2 shadow"
              >
                إضافة فعالية
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
                        <Button
                          size="sm"
                          variant="outline"
                          as={Link}
                          to={`/dashboard/events/${event.id}/edit`}
                          className="rounded-md"
                        >
                          تعديل
                        </Button>
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
                  المنظم
                </label>
                <p className="text-gray-900">{selectedEvent.organizer}</p>
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
                  السعة
                </label>
                <p className="text-gray-900">{selectedEvent.capacity} شخص</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر
                </label>
                <p className="text-gray-900">${selectedEvent.price}</p>
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
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  السعة
                </label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  السعر
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </div>
              <div>
                <label
                  htmlFor="organizer"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  المنظم
                </label>
                <Input
                  id="organizer"
                  name="organizer"
                  type="text"
                  value={form.organizer}
                  onChange={handleChange}
                  required
                  placeholder="اسم المنظم"
                />
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
