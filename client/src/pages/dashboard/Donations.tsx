import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDonations, deleteDonation } from '../../services/dashboardApi';
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
  Eye,
  Download,
  Upload,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  CreditCard,
  Building2,
  Wallet,
  Gift,
  Heart,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
} from 'lucide-react';
import QuickActions from '../../components/common/QuickActions';
import { Link } from 'react-router-dom';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank' | 'wallet' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  category: 'general' | 'events' | 'programs' | 'emergency' | 'education';
  description: string;
  date: string;
  anonymous: boolean;
  receiptNumber: string;
  transactionId: string;
  notes: string;
  location: string;
  campaign?: string;
}

const DonationsDashboard: React.FC = () => {
  // جلب قائمة التبرعات
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-donations'],
    queryFn: () => fetchDonations(),
  });

  // حالة النافذة المنبثقة
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');

  // حالة الفلترة والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // نموذج البيانات
  const [form, setForm] = useState({
    donorName: '',
    donorEmail: '',
    amount: '',
    currency: 'SAR',
    paymentMethod: '',
    category: '',
    description: '',
    anonymous: false,
    notes: '',
    location: '',
    campaign: '',
  });
  const [formError, setFormError] = useState('');
  const [modalMsg, setModalMsg] = useState('');

  // بيانات افتراضية للتبرعات
  const mockDonations: Donation[] = [
    {
      id: '1',
      donorName: 'أحمد محمد',
      donorEmail: 'ahmed@example.com',
      amount: 1000,
      currency: 'SAR',
      paymentMethod: 'card',
      status: 'completed',
      category: 'general',
      description: 'تبرع عام للمنظمة',
      date: '2024-06-01T10:30:00Z',
      anonymous: false,
      receiptNumber: 'RCP-2024-001',
      transactionId: 'TXN-2024-001',
      notes: 'تبرع شهري منتظم',
      location: 'الرياض، السعودية',
    },
    {
      id: '2',
      donorName: 'فاطمة علي',
      donorEmail: 'fatima@example.com',
      amount: 500,
      currency: 'SAR',
      paymentMethod: 'bank',
      status: 'completed',
      category: 'events',
      description: 'تبرع لفعالية الشباب',
      date: '2024-05-30T14:20:00Z',
      anonymous: true,
      receiptNumber: 'RCP-2024-002',
      transactionId: 'TXN-2024-002',
      notes: 'تبرع مجهول',
      location: 'جدة، السعودية',
      campaign: 'فعالية الشباب 2024',
    },
    {
      id: '3',
      donorName: 'عمر خالد',
      donorEmail: 'omar@example.com',
      amount: 2500,
      currency: 'SAR',
      paymentMethod: 'wallet',
      status: 'pending',
      category: 'programs',
      description: 'تبرع لبرنامج التعليم',
      date: '2024-05-29T09:15:00Z',
      anonymous: false,
      receiptNumber: 'RCP-2024-003',
      transactionId: 'TXN-2024-003',
      notes: 'تبرع لبرنامج تعليمي',
      location: 'الدمام، السعودية',
      campaign: 'برنامج التعليم المستمر',
    },
    {
      id: '4',
      donorName: 'سارة أحمد',
      donorEmail: 'sara@example.com',
      amount: 750,
      currency: 'SAR',
      paymentMethod: 'card',
      status: 'failed',
      category: 'emergency',
      description: 'تبرع للطوارئ',
      date: '2024-05-28T16:45:00Z',
      anonymous: false,
      receiptNumber: 'RCP-2024-004',
      transactionId: 'TXN-2024-004',
      notes: 'فشل في المعاملة',
      location: 'مكة، السعودية',
      campaign: 'صندوق الطوارئ',
    },
    {
      id: '5',
      donorName: 'يوسف عبدالله',
      donorEmail: 'youssef@example.com',
      amount: 300,
      currency: 'SAR',
      paymentMethod: 'cash',
      status: 'completed',
      category: 'education',
      description: 'تبرع للتعليم',
      date: '2024-05-27T11:30:00Z',
      anonymous: false,
      receiptNumber: 'RCP-2024-005',
      transactionId: 'TXN-2024-005',
      notes: 'تبرع نقدي',
      location: 'المدينة، السعودية',
      campaign: 'مبادرة التعليم للجميع',
    },
  ];

  const donations = data?.data?.items || mockDonations;

  // فلترة التبرعات
  const filteredDonations = donations.filter((donation: any) => {
    const matchesSearch =
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || donation.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || donation.category === categoryFilter;
    const matchesPayment =
      paymentFilter === 'all' || donation.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPayment;
  });

  // إحصائيات التبرعات
  const stats = {
    total: donations.reduce((sum: number, d: any) => sum + d.amount, 0),
    count: donations.length,
    completed: donations.filter((d: any) => d.status === 'completed').length,
    pending: donations.filter((d: any) => d.status === 'pending').length,
    failed: donations.filter((d: any) => d.status === 'failed').length,
    anonymous: donations.filter((d: any) => d.anonymous).length,
  };

  const handleOpenModal = (
    type: 'add' | 'edit' | 'view',
    donation?: Donation
  ) => {
    setModalType(type);
    setFormError('');

    if (type === 'add') {
      setForm({
        donorName: '',
        donorEmail: '',
        amount: '',
        currency: 'SAR',
        paymentMethod: '',
        category: '',
        description: '',
        anonymous: false,
        notes: '',
        location: '',
        campaign: '',
      });
      setSelectedDonation(null);
    } else if (donation) {
      setSelectedDonation(donation);
      setForm({
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        amount: donation.amount.toString(),
        currency: donation.currency,
        paymentMethod: donation.paymentMethod,
        category: donation.category,
        description: donation.description,
        anonymous: donation.anonymous,
        notes: donation.notes,
        location: donation.location,
        campaign: donation.campaign || '',
      });
    }

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDonation(null);
    setFormError('');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.donorName || !form.donorEmail || !form.amount) {
      setFormError('الحقول الأساسية مطلوبة');
      return;
    }
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setFormError('المبلغ يجب أن يكون رقم موجب');
      return;
    }

    // محاكاة عملية الإضافة/التعديل
    if (modalType === 'add') {
      console.log('إضافة تبرع جديد:', form);
      // هنا سيتم إرسال البيانات إلى API
      setModalMsg('تم إضافة التبرع بنجاح!');
    } else if (modalType === 'edit' && selectedDonation) {
      console.log('تعديل التبرع:', { id: selectedDonation.id, ...form });
      // هنا سيتم إرسال البيانات إلى API
      setModalMsg('تم تحديث التبرع بنجاح!');
    }

    setModalOpen(false);
    // إعادة تحميل البيانات
    // queryClient.invalidateQueries(['dashboard-donations']);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'failed':
        return 'فشل';
      case 'refunded':
        return 'مسترد';
      default:
        return 'غير محدد';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return CreditCard;
      case 'bank':
        return Building2;
      case 'wallet':
        return Wallet;
      case 'cash':
        return DollarSign;
      default:
        return DollarSign;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'card':
        return 'بطاقة ائتمان';
      case 'bank':
        return 'تحويل بنكي';
      case 'wallet':
        return 'محفظة إلكترونية';
      case 'cash':
        return 'نقدي';
      default:
        return 'غير محدد';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'general':
        return 'عام';
      case 'events':
        return 'فعاليات';
      case 'programs':
        return 'برامج';
      case 'emergency':
        return 'طوارئ';
      case 'education':
        return 'تعليم';
      default:
        return 'غير محدد';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التبرع؟')) {
      try {
        await deleteDonation(id);
        setModalMsg('تم حذف التبرع بنجاح!');
        setModalOpen(true);
        // إعادة تحميل البيانات
        queryClient.invalidateQueries({ queryKey: ['dashboard-donations'] });
      } catch (error) {
        console.error('خطأ في حذف التبرع:', error);
        setFormError('حدث خطأ أثناء حذف التبرع');
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
        <SkipToContent />
        <AccessibleSection>
          <Alert type="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء جلب قائمة التبرعات. يرجى المحاولة مرة أخرى.
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
                إدارة التبرعات
              </h1>
              <p className="text-gray-600">
                إدارة وتتبع جميع التبرعات والمساهمات
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                icon={Download}
                aria-label="تصدير التبرعات"
              >
                تصدير
              </Button>
              <Link to="/dashboard/donations/new">
                <Button icon={Plus}>تسجيل تبرع</Button>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mr-4 rtl:ml-4 rtl:mr-0">
                    <p className="text-sm font-medium text-gray-600">
                      إجمالي التبرعات
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats.total, 'SAR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">+12.5%</span>
                  <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
                    من الشهر الماضي
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mr-4 rtl:ml-4 rtl:mr-0">
                    <p className="text-sm font-medium text-gray-600">
                      عدد التبرعات
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.count}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-blue-600">{stats.completed}</span>
                  <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
                    مكتملة
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="mr-4 rtl:ml-4 rtl:mr-0">
                    <p className="text-sm font-medium text-gray-600">
                      قيد الانتظار
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.pending}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
                  <span className="text-yellow-600">{stats.failed}</span>
                  <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
                    فشلت
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="mr-4 rtl:ml-4 rtl:mr-0">
                    <p className="text-sm font-medium text-gray-600">
                      تبرعات مجهولة
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.anonymous}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <Gift className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-purple-600">+8.2%</span>
                  <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
                    من إجمالي التبرعات
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="البحث في التبرعات..."
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
                    setPaymentFilter('all');
                  }}
                >
                  إعادة تعيين
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <option value="completed">مكتمل</option>
                      <option value="pending">قيد الانتظار</option>
                      <option value="failed">فشل</option>
                      <option value="refunded">مسترد</option>
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
                      <option value="general">عام</option>
                      <option value="events">فعاليات</option>
                      <option value="programs">برامج</option>
                      <option value="emergency">طوارئ</option>
                      <option value="education">تعليم</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      طريقة الدفع
                    </label>
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الطرق</option>
                      <option value="card">بطاقة ائتمان</option>
                      <option value="bank">تحويل بنكي</option>
                      <option value="wallet">محفظة إلكترونية</option>
                      <option value="cash">نقدي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الترتيب
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="newest">الأحدث</option>
                      <option value="oldest">الأقدم</option>
                      <option value="amount-high">المبلغ الأعلى</option>
                      <option value="amount-low">المبلغ الأقل</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Donations Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map((donation: any) => {
                const PaymentIcon = getPaymentMethodIcon(
                  donation.paymentMethod
                );
                return (
                  <Card
                    key={donation.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {donation.anonymous
                              ? 'متبرع مجهول'
                              : donation.donorName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {donation.donorEmail}
                          </p>
                        </div>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`خيارات تبرع ${donation.donorName}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Amount and Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-primary-600">
                          {formatCurrency(donation.amount, donation.currency)}
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            donation.status
                          )}`}
                        >
                          {getStatusText(donation.status)}
                        </span>
                      </div>

                      {/* Payment Method and Category */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <PaymentIcon className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                          <span>
                            {getPaymentMethodText(donation.paymentMethod)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {getCategoryText(donation.category)}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {donation.description}
                        </p>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                          <span>{formatDate(donation.date)}</span>
                        </div>
                        {donation.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            <span>{donation.location}</span>
                          </div>
                        )}
                        {donation.campaign && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Target className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            <span>{donation.campaign}</span>
                          </div>
                        )}
                      </div>

                      {/* Receipt Number */}
                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                        <span>رقم الإيصال: {donation.receiptNumber}</span>
                        {donation.anonymous && (
                          <Heart className="w-4 h-4 text-red-500" />
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenModal('view', donation)}
                          icon={Eye}
                          className="flex-1"
                        >
                          عرض
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenModal('edit', donation)}
                          icon={Edit}
                          className="flex-1"
                        >
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(donation.id)}
                          icon={Trash2}
                          className="text-red-600 hover:text-red-700"
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredDonations.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد تبرعات
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ||
                statusFilter !== 'all' ||
                categoryFilter !== 'all'
                  ? 'لا توجد تبرعات تطابق معايير البحث المحددة'
                  : 'ابدأ بإضافة تبرع جديد'}
              </p>
              <Link to="/dashboard/donations/new">
                <Button icon={Plus}>تسجيل تبرع</Button>
              </Link>
            </Card>
          )}

          {/* Modal */}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'add'
                ? 'إضافة تبرع جديد'
                : modalType === 'edit'
                ? 'تعديل التبرع'
                : 'تفاصيل التبرع'
            }
          >
            {modalType === 'view' && selectedDonation ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedDonation.anonymous
                        ? 'متبرع مجهول'
                        : selectedDonation.donorName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedDonation.donorEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatCurrency(
                        selectedDonation.amount,
                        selectedDonation.currency
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedDonation.status
                      )}`}
                    >
                      {getStatusText(selectedDonation.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      طريقة الدفع
                    </label>
                    <div className="flex items-center">
                      {(() => {
                        const PaymentIcon = getPaymentMethodIcon(
                          selectedDonation.paymentMethod
                        );
                        return (
                          <PaymentIcon className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        );
                      })()}
                      <span className="text-gray-900">
                        {getPaymentMethodText(selectedDonation.paymentMethod)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الفئة
                    </label>
                    <span className="text-gray-900">
                      {getCategoryText(selectedDonation.category)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <p className="text-gray-900">
                    {selectedDonation.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الإيصال
                    </label>
                    <p className="text-gray-900">
                      {selectedDonation.receiptNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم المعاملة
                    </label>
                    <p className="text-gray-900">
                      {selectedDonation.transactionId}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التاريخ
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedDonation.date)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الموقع
                    </label>
                    <p className="text-gray-900">{selectedDonation.location}</p>
                  </div>
                </div>

                {selectedDonation.campaign && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الحملة
                    </label>
                    <p className="text-gray-900">{selectedDonation.campaign}</p>
                  </div>
                )}

                {selectedDonation.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الملاحظات
                    </label>
                    <p className="text-gray-900">{selectedDonation.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleOpenModal('edit', selectedDonation)}
                    className="flex-1"
                  >
                    تعديل التبرع
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
                      htmlFor="donorName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      اسم المتبرع
                    </label>
                    <Input
                      id="donorName"
                      name="donorName"
                      type="text"
                      value={form.donorName}
                      onChange={handleChange}
                      required
                      placeholder="اسم المتبرع"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="donorEmail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      البريد الإلكتروني
                    </label>
                    <Input
                      id="donorEmail"
                      name="donorEmail"
                      type="email"
                      value={form.donorEmail}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      المبلغ
                    </label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={form.amount}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="currency"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      العملة
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="SAR">ريال سعودي (SAR)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="EUR">يورو (EUR)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      طريقة الدفع
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">اختر طريقة الدفع</option>
                      <option value="card">بطاقة ائتمان</option>
                      <option value="bank">تحويل بنكي</option>
                      <option value="wallet">محفظة إلكترونية</option>
                      <option value="cash">نقدي</option>
                    </select>
                  </div>
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
                      <option value="general">عام</option>
                      <option value="events">فعاليات</option>
                      <option value="programs">برامج</option>
                      <option value="emergency">طوارئ</option>
                      <option value="education">تعليم</option>
                    </select>
                  </div>
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
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="وصف التبرع"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      htmlFor="campaign"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      الحملة (اختياري)
                    </label>
                    <Input
                      id="campaign"
                      name="campaign"
                      type="text"
                      value={form.campaign}
                      onChange={handleChange}
                      placeholder="اسم الحملة"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الملاحظات
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="ملاحظات إضافية"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="anonymous"
                    name="anonymous"
                    type="checkbox"
                    checked={form.anonymous}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="anonymous"
                    className="mr-2 rtl:ml-2 rtl:mr-0 text-sm text-gray-700"
                  >
                    تبرع مجهول
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {modalType === 'add' ? 'إضافة التبرع' : 'حفظ التغييرات'}
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

export default DonationsDashboard;
