import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchReports } from '../../services/dashboardApi';
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
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Target,
  Award,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  BarChart,
  LineChart,
  PieChart as PieChartIcon,
  Download as DownloadIcon,
  RefreshCw,
  Settings,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileSpreadsheet,
  FilePdf,
  FileImage,
  Share,
  Mail,
  Printer,
  BookOpen,
  Activity,
  TrendingDown,
  Zap,
  Lightbulb,
  Shield,
  Globe,
  Lock,
  Unlock,
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'analytics' | 'financial' | 'performance' | 'user' | 'custom';
  category: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  author: string;
  createdDate: string;
  lastModified: string;
  scheduledDate?: string;
  views: number;
  downloads: number;
  shares: number;
  description: string;
  data: any;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  isPublic: boolean;
  isFeatured: boolean;
  recipients: string[];
  tags: string[];
  permissions: string[];
}

const ReportsDashboard: React.FC = () => {
  // جلب قائمة التقارير
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-reports'],
    queryFn: () => fetchReports(),
  });

  // حالة النافذة المنبثقة
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');

  // حالة الفلترة والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // نموذج البيانات
  const [form, setForm] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    format: 'pdf',
    scheduledDate: '',
    isPublic: true,
    isFeatured: false,
    recipients: '',
    tags: '',
  });
  const [formError, setFormError] = useState('');

  // بيانات افتراضية للتقارير
  const mockReports: Report[] = [
    {
      id: '1',
      title: 'تقرير الأداء الشهري - يونيو 2024',
      type: 'performance',
      category: 'monthly',
      status: 'published',
      author: 'أحمد محمد',
      createdDate: '2024-06-01T10:30:00Z',
      lastModified: '2024-06-01T10:30:00Z',
      views: 125,
      downloads: 45,
      shares: 12,
      description: 'تقرير شامل عن أداء المنظمة خلال شهر يونيو 2024',
      data: { events: 15, programs: 8, users: 1250, donations: 75000 },
      format: 'pdf',
      isPublic: true,
      isFeatured: true,
      recipients: ['admin@shababna.org', 'manager@shababna.org'],
      tags: ['أداء', 'شهري', '2024'],
      permissions: ['view', 'download', 'share'],
    },
    {
      id: '2',
      title: 'تحليل البيانات المالية - الربع الثاني',
      type: 'financial',
      category: 'quarterly',
      status: 'published',
      author: 'فاطمة علي',
      createdDate: '2024-05-30T14:20:00Z',
      lastModified: '2024-05-30T14:20:00Z',
      views: 89,
      downloads: 23,
      shares: 8,
      description: 'تحليل شامل للبيانات المالية للربع الثاني من 2024',
      data: { income: 150000, expenses: 95000, profit: 55000 },
      format: 'excel',
      isPublic: false,
      isFeatured: false,
      recipients: ['finance@shababna.org'],
      tags: ['مالي', 'ربع سنوي', 'تحليل'],
      permissions: ['view', 'download'],
    },
    {
      id: '3',
      title: 'تقرير تحليلات المستخدمين',
      type: 'analytics',
      category: 'monthly',
      status: 'draft',
      author: 'عمر خالد',
      createdDate: '2024-05-29T09:15:00Z',
      lastModified: '2024-05-29T09:15:00Z',
      views: 0,
      downloads: 0,
      shares: 0,
      description: 'تحليل سلوك المستخدمين وأنماط الاستخدام',
      data: { activeUsers: 890, newUsers: 125, retention: 78 },
      format: 'csv',
      isPublic: true,
      isFeatured: false,
      recipients: ['analytics@shababna.org'],
      tags: ['تحليلات', 'مستخدمين', 'سلوك'],
      permissions: ['view'],
    },
    {
      id: '4',
      title: 'تقرير الفعاليات السنوي 2024',
      type: 'custom',
      category: 'yearly',
      status: 'scheduled',
      author: 'سارة أحمد',
      createdDate: '2024-05-28T16:45:00Z',
      lastModified: '2024-05-28T16:45:00Z',
      scheduledDate: '2024-12-31T23:59:59Z',
      views: 0,
      downloads: 0,
      shares: 0,
      description: 'تقرير شامل عن جميع الفعاليات المنظمة خلال 2024',
      data: { totalEvents: 45, participants: 2500, locations: 8 },
      format: 'pdf',
      isPublic: true,
      isFeatured: true,
      recipients: ['events@shababna.org', 'public@shababna.org'],
      tags: ['فعاليات', 'سنوي', '2024'],
      permissions: ['view', 'download', 'share'],
    },
    {
      id: '5',
      title: 'تقرير التبرعات والميزانية',
      type: 'financial',
      category: 'monthly',
      status: 'archived',
      author: 'يوسف عبدالله',
      createdDate: '2024-04-30T11:30:00Z',
      lastModified: '2024-04-30T11:30:00Z',
      views: 67,
      downloads: 15,
      shares: 5,
      description: 'تقرير التبرعات والميزانية الشهرية',
      data: { donations: 45000, budget: 120000, utilization: 85 },
      format: 'excel',
      isPublic: false,
      isFeatured: false,
      recipients: ['finance@shababna.org'],
      tags: ['تبرعات', 'ميزانية', 'شهري'],
      permissions: ['view'],
    },
  ];

  const reports = data?.data?.items || mockReports;

  // فلترة التقارير
  const filteredReports = reports.filter((item: any) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleOpenModal = (type: 'add' | 'edit' | 'view', report?: Report) => {
    setModalType(type);
    setFormError('');

    if (type === 'add') {
      setForm({
        title: '',
        type: '',
        category: '',
        description: '',
        format: 'pdf',
        scheduledDate: '',
        isPublic: true,
        isFeatured: false,
        recipients: '',
        tags: '',
      });
      setSelectedReport(null);
    } else if (report) {
      setSelectedReport(report);
      setForm({
        title: report.title,
        type: report.type,
        category: report.category,
        description: report.description,
        format: report.format,
        scheduledDate: report.scheduledDate || '',
        isPublic: report.isPublic,
        isFeatured: report.isFeatured,
        recipients: report.recipients.join(', '),
        tags: report.tags.join(', '),
      });
    }

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
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
    if (!form.title || !form.type || !form.category || !form.description) {
      setFormError('الحقول الأساسية مطلوبة');
      return;
    }
    // هنا سيتم الربط مع API لاحقًا
    console.log('Form submitted:', form);
    setModalOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analytics':
        return BarChart3;
      case 'financial':
        return DollarSign;
      case 'performance':
        return Target;
      case 'user':
        return Users;
      case 'custom':
        return FileText;
      default:
        return FileText;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'analytics':
        return 'تحليلات';
      case 'financial':
        return 'مالي';
      case 'performance':
        return 'أداء';
      case 'user':
        return 'مستخدمين';
      case 'custom':
        return 'مخصص';
      default:
        return 'غير محدد';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'monthly':
        return 'شهري';
      case 'quarterly':
        return 'ربع سنوي';
      case 'yearly':
        return 'سنوي';
      case 'custom':
        return 'مخصص';
      default:
        return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'منشور';
      case 'draft':
        return 'مسودة';
      case 'archived':
        return 'مؤرشف';
      case 'scheduled':
        return 'مجدول';
      default:
        return 'غير محدد';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return FilePdf;
      case 'excel':
        return FileSpreadsheet;
      case 'csv':
        return FileText;
      case 'json':
        return FileText;
      default:
        return FileText;
    }
  };

  const getFormatText = (format: string) => {
    switch (format) {
      case 'pdf':
        return 'PDF';
      case 'excel':
        return 'Excel';
      case 'csv':
        return 'CSV';
      case 'json':
        return 'JSON';
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <DashboardLayout>
        <SkipToContent />
        <AccessibleSection>
          <Alert type="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء جلب قائمة التقارير. يرجى المحاولة مرة أخرى.
          </Alert>
        </AccessibleSection>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SkipToContent />

      <AccessibleSection>
        <div className="max-w-7xl mx-auto py-6 px-2 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                إدارة التقارير
              </h1>
              <p className="text-gray-600">إنشاء وإدارة جميع أنواع التقارير</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                icon={Download}
                aria-label="تصدير التقارير"
              >
                تصدير
              </Button>
              <Button
                onClick={() => handleOpenModal('add')}
                aria-label="إنشاء تقرير جديد"
                icon={Plus}
              >
                تقرير جديد
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="البحث في التقارير..."
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
                    setTypeFilter('all');
                    setCategoryFilter('all');
                    setStatusFilter('all');
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
                      النوع
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الأنواع</option>
                      <option value="analytics">تحليلات</option>
                      <option value="financial">مالي</option>
                      <option value="performance">أداء</option>
                      <option value="user">مستخدمين</option>
                      <option value="custom">مخصص</option>
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
                      <option value="monthly">شهري</option>
                      <option value="quarterly">ربع سنوي</option>
                      <option value="yearly">سنوي</option>
                      <option value="custom">مخصص</option>
                    </select>
                  </div>
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
                      <option value="published">منشور</option>
                      <option value="draft">مسودة</option>
                      <option value="archived">مؤرشف</option>
                      <option value="scheduled">مجدول</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الترتيب
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="newest">الأحدث</option>
                      <option value="oldest">الأقدم</option>
                      <option value="title">العنوان</option>
                      <option value="views">المشاهدات</option>
                      <option value="downloads">التحميلات</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Reports Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((item: any) => {
                const TypeIcon = getTypeIcon(item.type);
                const FormatIcon = getFormatIcon(item.format);
                return (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <TypeIcon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.author}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`خيارات تقرير ${item.title}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Status and Type Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusText(item.status)}
                        </span>
                        <div className="flex items-center gap-1">
                          <FormatIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {getFormatText(item.format)}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags
                          .slice(0, 3)
                          .map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
                        <div>
                          <div className="flex items-center justify-center text-blue-600 mb-1">
                            <Eye className="w-4 h-4" />
                          </div>
                          <div className="font-medium text-gray-900">
                            {item.views}
                          </div>
                          <div className="text-xs text-gray-500">مشاهدة</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center text-green-600 mb-1">
                            <Download className="w-4 h-4" />
                          </div>
                          <div className="font-medium text-gray-900">
                            {item.downloads}
                          </div>
                          <div className="text-xs text-gray-500">تحميل</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center text-purple-600 mb-1">
                            <Share className="w-4 h-4" />
                          </div>
                          <div className="font-medium text-gray-900">
                            {item.shares}
                          </div>
                          <div className="text-xs text-gray-500">مشاركة</div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 mb-4 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                          <span>{formatDate(item.createdDate)}</span>
                        </div>
                        {item.scheduledDate && (
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                            <span>مجدول: {formatDate(item.scheduledDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">
                            {getTypeText(item.type)} •{' '}
                            {getCategoryText(item.category)}
                          </span>
                        </div>
                      </div>

                      {/* Visibility and Featured */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {item.isPublic ? (
                            <Globe className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-xs text-gray-600">
                            {item.isPublic ? 'عام' : 'خاص'}
                          </span>
                        </div>
                        {item.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenModal('view', item)}
                          icon={Eye}
                          className="flex-1"
                        >
                          عرض
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenModal('edit', item)}
                          icon={Edit}
                          className="flex-1"
                        >
                          تعديل
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredReports.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا يوجد تقارير
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                  ? 'لا يوجد تقارير تطابق معايير البحث المحددة'
                  : 'ابدأ بإنشاء تقرير جديد'}
              </p>
              <Button onClick={() => handleOpenModal('add')} icon={Plus}>
                إنشاء تقرير جديد
              </Button>
            </Card>
          )}

          {/* Modal */}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'add'
                ? 'إنشاء تقرير جديد'
                : modalType === 'edit'
                ? 'تعديل التقرير'
                : 'تفاصيل التقرير'
            }
          >
            {modalType === 'view' && selectedReport ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const TypeIcon = getTypeIcon(selectedReport.type);
                    return (
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <TypeIcon className="w-6 h-6 text-primary-600" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedReport.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedReport.author}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      النوع
                    </label>
                    <span className="text-gray-900">
                      {getTypeText(selectedReport.type)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الفئة
                    </label>
                    <span className="text-gray-900">
                      {getCategoryText(selectedReport.category)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <p className="text-gray-900">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الإنشاء
                    </label>
                    <p className="text-gray-900">
                      {formatDateTime(selectedReport.createdDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آخر تعديل
                    </label>
                    <p className="text-gray-900">
                      {formatDateTime(selectedReport.lastModified)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {selectedReport.views}
                    </div>
                    <div className="text-xs text-gray-600">مشاهدة</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {selectedReport.downloads}
                    </div>
                    <div className="text-xs text-gray-600">تحميل</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {selectedReport.shares}
                    </div>
                    <div className="text-xs text-gray-600">مشاركة</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleOpenModal('edit', selectedReport)}
                    className="flex-1"
                  >
                    تعديل التقرير
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
                    عنوان التقرير
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="عنوان التقرير"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      نوع التقرير
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">اختر النوع</option>
                      <option value="analytics">تحليلات</option>
                      <option value="financial">مالي</option>
                      <option value="performance">أداء</option>
                      <option value="user">مستخدمين</option>
                      <option value="custom">مخصص</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      فئة التقرير
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
                      <option value="monthly">شهري</option>
                      <option value="quarterly">ربع سنوي</option>
                      <option value="yearly">سنوي</option>
                      <option value="custom">مخصص</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    وصف التقرير
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="وصف التقرير"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="format"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      تنسيق التقرير
                    </label>
                    <select
                      id="format"
                      name="format"
                      value={form.format}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="scheduledDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      تاريخ الجدولة (اختياري)
                    </label>
                    <Input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="datetime-local"
                      value={form.scheduledDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="recipients"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    المستلمون (اختياري)
                  </label>
                  <Input
                    id="recipients"
                    name="recipients"
                    type="text"
                    value={form.recipients}
                    onChange={handleChange}
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الكلمات المفتاحية
                  </label>
                  <Input
                    id="tags"
                    name="tags"
                    type="text"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="كلمة مفتاحية 1, كلمة مفتاحية 2, ..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      id="isPublic"
                      name="isPublic"
                      type="checkbox"
                      checked={form.isPublic}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isPublic"
                      className="mr-2 rtl:ml-2 rtl:mr-0 text-sm text-gray-700"
                    >
                      تقرير عام
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isFeatured"
                      name="isFeatured"
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isFeatured"
                      className="mr-2 rtl:ml-2 rtl:mr-0 text-sm text-gray-700"
                    >
                      تقرير مميز
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {modalType === 'add' ? 'إنشاء التقرير' : 'حفظ التغييرات'}
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

export default ReportsDashboard;
