import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchReports } from '../../services/dashboardApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';
import { Input } from '../../components/ui/Input';
import {
  AccessibleSection,
  SkipToContent,
} from '../../components/common/AccessibleComponents';
import {
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
import ReportCard from '../../components/dashboard/ReportCard';

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
        return FileSpreadsheet;
      default:
        return FileSpreadsheet;
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
        return FileSpreadsheet;
      case 'excel':
        return FileSpreadsheet;
      case 'csv':
        return BarChart3;
      case 'json':
        return BarChart3;
      default:
        return BarChart3;
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
      <div className="p-8 text-center text-xl text-gray-600">
        صفحة التقارير معطلة مؤقتاً. سيتم إعادة تفعيلها لاحقاً عند الحاجة.
      </div>
    </DashboardLayout>
  );
};

export default ReportsDashboard;
