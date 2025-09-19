import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  Calendar,
  Heart,
  Eye,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Target,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  User,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  GraduationCap,
  UserPlus,
} from 'lucide-react';

import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SEO from '../../components/common/SEO';
import { http as api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

// Types
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

interface EventRegistration {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  event_title: string;
  event_id: number;
  created_at: string;
}

interface ProgramSupporter {
  id: number;
  supporter_name: string;
  supporter_email: string;
  supporter_phone?: string;
  program_title?: string;
  program_id?: number;
  support_type: string;
  amount?: number;
  status: string;
  created_at: string;
}

interface ProgramRegistration {
  id: number;
  user_name?: string;
  user_email?: string;
  program_title: string;
  program_id: number;
  created_at: string;
}

const RegistrantsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // Get authentication state
  const { user, token, isAuthenticated } = useAuthStore();

  // Active tab state
  const [activeTab, setActiveTab] = useState<
    'users' | 'events' | 'programs' | 'join-requests'
  >('join-requests');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Selected item for details drawer
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch users data
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch event registrations data
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ['dashboard-event-registrations'],
    queryFn: async () => {
      const response = await api.get('/forms/event-registrations');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch program supporters data
  const {
    data: supportersData,
    isLoading: supportersLoading,
    error: supportersError,
    refetch: refetchSupporters,
  } = useQuery({
    queryKey: ['dashboard-program-supporters'],
    queryFn: async () => {
      const response = await api.get('/programs/supporters');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch join requests data
  const {
    data: joinRequestsData,
    isLoading: joinRequestsLoading,
    error: joinRequestsError,
    refetch: refetchJoinRequests,
  } = useQuery({
    queryKey: ['dashboard-join-requests'],
    queryFn: async () => {
      const response = await api.get('/forms/join-requests');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Get data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'users':
        return {
          data: usersData?.data?.items || [],
          loading: usersLoading,
          error: usersError,
          refetch: refetchUsers,
        };
      case 'events':
        return {
          data: eventsData?.data?.registrations || [],
          loading: eventsLoading,
          error: eventsError,
          refetch: refetchEvents,
        };
      case 'programs':
        return {
          data: supportersData?.data?.supporters || [],
          loading: supportersLoading,
          error: supportersError,
          refetch: refetchSupporters,
        };
      case 'join-requests':
        return {
          data: joinRequestsData?.data?.requests || [],
          loading: joinRequestsLoading,
          error: joinRequestsError,
          refetch: refetchJoinRequests,
        };
      default:
        return { data: [], loading: false, error: null, refetch: () => {} };
    }
  };

  const {
    data: currentData,
    loading: currentLoading,
    error: currentError,
    refetch: currentRefetch,
  } = getCurrentData();

  // Filter and sort data
  const filteredData = currentData.filter((item: any) => {
    const matchesSearch =
      (item.first_name?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (item.last_name?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (item.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.supporter_name?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (item.supporter_email?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (item.user_name?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (item.user_email?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (item.specialization?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (item.occupation?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = `${a.first_name || a.supporter_name || a.user_name || ''} ${
          a.last_name || ''
        }`;
        bValue = `${b.first_name || b.supporter_name || b.user_name || ''} ${
          b.last_name || ''
        }`;
        break;
      case 'email':
        aValue = a.email || a.supporter_email || a.user_email || '';
        bValue = b.email || b.supporter_email || b.user_email || '';
        break;
      case 'date':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'specialization':
        aValue = a.specialization || '';
        bValue = b.specialization || '';
        break;
      case 'age':
        aValue = a.age || 0;
        bValue = b.age || 0;
        break;
      default:
        aValue = a.first_name || a.supporter_name || a.user_name || '';
        bValue = b.first_name || b.supporter_name || b.user_name || '';
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Handle item selection for details
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'غير محدد';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'inactive':
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'completed':
        return 'مكتمل';
      case 'confirmed':
        return 'مؤكد';
      case 'pending':
        return 'قيد الانتظار';
      case 'inactive':
        return 'غير نشط';
      case 'cancelled':
        return 'ملغي';
      default:
        return status || 'غير محدد';
    }
  };

  // Render table headers
  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'users':
        return (
          <>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              المستخدم
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              معلومات التواصل
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              الدور
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              تاريخ الإنشاء
            </th>
          </>
        );
      case 'events':
        return (
          <>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              المسجل
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              الفعالية
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              معلومات التواصل
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              تاريخ التسجيل
            </th>
          </>
        );
      case 'programs':
        return (
          <>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              الداعم
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              البرنامج
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              نوع الدعم
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              المبلغ
            </th>
          </>
        );
      case 'join-requests':
        return (
          <>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              العضو
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              بلد الإقامة
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              الجنسية
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              التخصص
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              الاهتمامات
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              الحالة الاجتماعية
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900">
              التاريخ
            </th>
          </>
        );
      default:
        return null;
    }
  };

  // Render table rows
  const renderTableRows = () => {
    return paginatedData.map((item: any, index: number) => {
      switch (activeTab) {
        case 'users':
          return (
            <tr
              key={item.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {item.first_name?.charAt(0) || ''}
                      {item.last_name?.charAt(0) || ''}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.first_name} {item.last_name}
                    </div>
                    <div className="text-sm text-gray-500">ID: {item.id}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{item.email}</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    item.role === 'admin'
                      ? 'text-red-600 bg-red-50 border-red-200'
                      : item.role === 'user'
                      ? 'text-green-600 bg-green-50 border-green-200'
                      : 'text-gray-600 bg-gray-50 border-gray-200'
                  }`}
                >
                  {item.role === 'admin'
                    ? 'مدير'
                    : item.role === 'user'
                    ? 'مستخدم'
                    : item.role}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-gray-600">
                  {formatDate(item.created_at)}
                </div>
              </td>
            </tr>
          );
        case 'events':
          return (
            <tr
              key={item.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {item.first_name?.charAt(0) || ''}
                      {item.last_name?.charAt(0) || ''}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.first_name} {item.last_name}
                    </div>
                    <div className="text-sm text-gray-500">ID: {item.id}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                {item.event_title ? (
                  <Link
                    to={`/events/${item.event_id || '#'}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {item.event_title}
                  </Link>
                ) : (
                  <span className="text-gray-500">غير محدد</span>
                )}
              </td>
              <td className="py-4 px-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{item.email}</span>
                  </div>
                  {item.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{item.phone}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-gray-600">
                  {formatDate(item.created_at)}
                </div>
              </td>
            </tr>
          );
        case 'programs':
          return (
            <tr
              key={item.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {item.supporter_name?.charAt(0) ||
                        item.user_name?.charAt(0) ||
                        ''}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.supporter_name || item.user_name}
                    </div>
                    <div className="text-sm text-gray-500">ID: {item.id}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                {item.program_title ? (
                  <Link
                    to={`/programs/${item.program_id || '#'}`}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    {item.program_title}
                  </Link>
                ) : (
                  <span className="text-gray-500">غير محدد</span>
                )}
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600">
                  {item.support_type === 'donation'
                    ? 'تبرع'
                    : item.support_type || 'دعم'}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm font-medium text-gray-900">
                  {item.amount ? `${item.amount} ريال` : 'غير محدد'}
                </div>
              </td>
            </tr>
          );
        case 'join-requests':
          return (
            <tr
              key={item.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">
                      {item.first_name?.charAt(0) || ''}
                      {item.last_name?.charAt(0) || ''}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.first_name} {item.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{item.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-400 ml-1" />
                  {item.country_of_residence || item.country || '-'}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center text-sm text-gray-900">
                  <Globe className="w-4 h-4 text-gray-400 ml-1" />
                  {item.nationality || '-'}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center text-sm text-gray-900">
                  <GraduationCap className="w-4 h-4 text-gray-400 ml-1" />
                  {item.specialization || '-'}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-gray-900">
                  {item.interests && item.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.interests
                        .slice(0, 2)
                        .map((interest: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {interest}
                          </span>
                        ))}
                      {item.interests.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{item.interests.length - 2} أخرى
                        </span>
                      )}
                    </div>
                  ) : (
                    '-'
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center text-sm text-gray-900">
                  <Heart className="w-4 h-4 text-gray-400 ml-1" />
                  {item.marital_status || '-'}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-gray-600">
                  {formatDate(item.created_at)}
                </div>
              </td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  if (currentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-red-800 font-semibold mb-2 text-center">
            خطأ في تحميل البيانات
          </h3>
          <p className="text-red-700 text-center mb-6">
            حدث خطأ أثناء تحميل بيانات المسجلين. تأكد من اتصال الخادم.
          </p>
          <Button
            onClick={() => currentRefetch()}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEO title="إدارة المسجلين" description="إدارة جميع المسجلين في المنصة" />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              إدارة المسجلين
            </h1>
            <p className="text-gray-600">عرض وإدارة جميع المسجلين في المنصة</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => currentRefetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-right">
              <span className="text-xs text-blue-600">إجمالي</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {usersData?.data?.items?.length || 0}
            </h3>
            <p className="text-sm text-gray-600">المستخدمين/الأعضاء</p>
          </div>
        </Card>

        <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-green-50">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-right">
              <span className="text-xs text-green-600">إجمالي</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {eventsData?.data?.registrations?.length || 0}
            </h3>
            <p className="text-sm text-gray-600">تسجيلات الفعاليات</p>
          </div>
        </Card>

        <Card className="p-5 hover:shadow-sm transition-all duration-200 border border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Heart className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-right">
              <span className="text-xs text-purple-600">إجمالي</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {joinRequestsData?.data?.requests?.length || 0}
            </h3>
            <p className="text-sm text-gray-600">طلبات الانضمام</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                المستخدمون/الأعضاء
              </div>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                تسجيلات الفعاليات
              </div>
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'programs'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                دعم البرامج
              </div>
            </button>
            <button
              onClick={() => setActiveTab('join-requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'join-requests'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                طلبات الانضمام
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <Card className="p-6 bg-gradient-to-r from-white to-secondary-50 border-secondary-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="البحث في المسجلين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-white border-secondary-200 focus:border-secondary-500 focus:ring-secondary-500 shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50"
              >
                <Filter className="w-4 h-4" />
                الفلترة
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50"
              >
                <Download className="w-4 h-4" />
                تصدير
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-secondary-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="active">نشط</option>
                    <option value="pending">قيد الانتظار</option>
                    <option value="completed">مكتمل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ترتيب حسب
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 bg-white"
                  >
                    <option value="name">الاسم</option>
                    <option value="email">البريد الإلكتروني</option>
                    <option value="date">التاريخ</option>
                    <option value="specialization">التخصص</option>
                    <option value="age">العمر</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </div>

      {/* Data Table */}
      <div>
        <Card className="p-6">
          {paginatedData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد بيانات للعرض
              </h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'users' && 'لا يوجد مستخدمون مسجلون حالياً'}
                {activeTab === 'events' &&
                  'لا توجد تسجيلات في الفعاليات حالياً'}
                {activeTab === 'programs' &&
                  'لا توجد تسجيلات في البرامج حالياً'}
                {activeTab === 'join-requests' && 'لا توجد طلبات انضمام حالياً'}
              </p>
              <Button
                onClick={() => currentRefetch()}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة تحميل البيانات
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {renderTableHeaders()}
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                عرض {startIndex + 1} إلى{' '}
                {Math.min(startIndex + itemsPerPage, sortedData.length)} من{' '}
                {sortedData.length} نتيجة
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-700">
                  صفحة {currentPage} من {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Details Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    تفاصيل المسجل
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDrawerOpen(false)}
                    className="p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {activeTab === 'users' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الاسم الكامل
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.first_name} {selectedItem.last_name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          البريد الإلكتروني
                        </label>
                        <p className="text-gray-900">{selectedItem.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الدور
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.role === 'admin' ? 'مدير' : 'مستخدم'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ الإنشاء
                        </label>
                        <p className="text-gray-900">
                          {formatDate(selectedItem.created_at)}
                        </p>
                      </div>
                    </>
                  )}

                  {activeTab === 'events' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الاسم الكامل
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.first_name} {selectedItem.last_name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          البريد الإلكتروني
                        </label>
                        <p className="text-gray-900">{selectedItem.email}</p>
                      </div>
                      {selectedItem.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            رقم الهاتف
                          </label>
                          <p className="text-gray-900">{selectedItem.phone}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الفعالية
                        </label>
                        {selectedItem.event_title ? (
                          <Link
                            to={`/events/${selectedItem.event_id || '#'}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {selectedItem.event_title}
                          </Link>
                        ) : (
                          <span className="text-gray-500">غير محدد</span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ التسجيل
                        </label>
                        <p className="text-gray-900">
                          {formatDate(selectedItem.created_at)}
                        </p>
                      </div>
                    </>
                  )}

                  {activeTab === 'programs' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          اسم الداعم
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.supporter_name ||
                            selectedItem.user_name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          البريد الإلكتروني
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.supporter_email ||
                            selectedItem.user_email}
                        </p>
                      </div>
                      {selectedItem.supporter_phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            رقم الهاتف
                          </label>
                          <p className="text-gray-900">
                            {selectedItem.supporter_phone}
                          </p>
                        </div>
                      )}
                      {selectedItem.program_title && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            البرنامج
                          </label>
                          <Link
                            to={`/programs/${selectedItem.program_id || '#'}`}
                            className="text-green-600 hover:text-green-800"
                          >
                            {selectedItem.program_title}
                          </Link>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          نوع الدعم
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.support_type === 'donation'
                            ? 'تبرع'
                            : selectedItem.support_type}
                        </p>
                      </div>
                      {selectedItem.amount && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            المبلغ
                          </label>
                          <p className="text-gray-900">
                            {selectedItem.amount} ريال
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الحالة
                        </label>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            selectedItem.status
                          )}`}
                        >
                          {getStatusText(selectedItem.status)}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ الدعم
                        </label>
                        <p className="text-gray-900">
                          {formatDate(selectedItem.created_at)}
                        </p>
                      </div>
                    </>
                  )}

                  {activeTab === 'join-requests' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الاسم الكامل
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.first_name} {selectedItem.last_name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          البريد الإلكتروني
                        </label>
                        <p className="text-gray-900">{selectedItem.email}</p>
                      </div>
                      {selectedItem.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            رقم الهاتف
                          </label>
                          <p className="text-gray-900">{selectedItem.phone}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          العمر
                        </label>
                        <p className="text-gray-900">{selectedItem.age}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          بلد الإقامة
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.country_of_residence ||
                            selectedItem.country}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الجنسية
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.nationality || '-'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الحالة الاجتماعية
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.marital_status || '-'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          التخصص
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.specialization || '-'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الوظيفة
                        </label>
                        <p className="text-gray-900">
                          {selectedItem.occupation || '-'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الاهتمامات
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.interests &&
                          selectedItem.interests.length > 0 ? (
                            selectedItem.interests.map(
                              (interest: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                                >
                                  {interest}
                                </span>
                              )
                            )
                          ) : (
                            <span className="text-gray-500">
                              لا توجد اهتمامات محددة
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          سبب الانضمام
                        </label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {selectedItem.motivation}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ الطلب
                        </label>
                        <p className="text-gray-900">
                          {formatDate(selectedItem.created_at)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrantsDashboard;
