import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchJoinRequests } from '../../services/dashboardApi';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { Input } from '../../components/ui/Input/Input';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Globe,
  Heart,
  GraduationCap,
  Users,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import SEO from '../../components/common/SEO';

interface JoinRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  age: number;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  // الحقول الجديدة
  country_of_residence?: string;
  nationality?: string;
  specialization?: string;
  interests?: string[];
  other_interests?: string;
  occupation?: string;
  marital_status?: string;
}

const JoinRequestsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // جلب طلبات الانضمام
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['join-requests'],
    queryFn: () => fetchJoinRequests({ page: 1, limit: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  // حالة الفلترة والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // استخدام البيانات الحقيقية من API
  const requests = data?.data?.requests || [];

  // فلترة البيانات
  const filteredRequests = requests.filter((request: JoinRequest) => {
    const matchesSearch =
      request.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.specialization
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.occupation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ترتيب البيانات
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const aValue = a[sortBy as keyof JoinRequest];
    const bValue = b[sortBy as keyof JoinRequest];

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        title="خطأ في تحميل البيانات"
        message="حدث خطأ أثناء جلب طلبات الانضمام. يرجى المحاولة مرة أخرى."
        action={
          <Button variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <SEO
        title={t('joinRequests.seo.title', 'طلبات الانضمام')}
        description={t(
          'joinRequests.seo.description',
          'إدارة طلبات الانضمام الجديدة'
        )}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('joinRequests.title')}
            </h1>
            <p className="text-gray-600">{t('joinRequests.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t('joinRequests.refresh')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t('joinRequests.stats.total')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t('joinRequests.stats.pending')}
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {
                  requests.filter((r: JoinRequest) => r.status === 'pending')
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t('joinRequests.stats.approved')}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {
                  requests.filter((r: JoinRequest) => r.status === 'approved')
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t('joinRequests.stats.rejected')}
              </p>
              <p className="text-2xl font-bold text-red-600">
                {
                  requests.filter((r: JoinRequest) => r.status === 'rejected')
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('joinRequests.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{t('joinRequests.filters.all')}</option>
              <option value="pending">
                {t('joinRequests.filters.pending')}
              </option>
              <option value="approved">
                {t('joinRequests.filters.approved')}
              </option>
              <option value="rejected">
                {t('joinRequests.filters.rejected')}
              </option>
            </select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              فلاتر
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ترتيب حسب
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="created_at">تاريخ الإرسال</option>
                  <option value="first_name">الاسم الأول</option>
                  <option value="last_name">اسم العائلة</option>
                  <option value="age">العمر</option>
                  <option value="status">الحالة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اتجاه الترتيب
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as 'asc' | 'desc')
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="desc">الأحدث أولاً</option>
                  <option value="asc">الأقدم أولاً</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Requests Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('joinRequests.table.member')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('joinRequests.table.country')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('joinRequests.table.nationality')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('joinRequests.table.specialization')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('joinRequests.table.interests')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('joinRequests.table.maritalStatus')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('joinRequests.table.date')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRequests.map((request) => {
                return (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {request.first_name?.charAt(0) || ''}
                            {request.last_name?.charAt(0) || ''}
                          </span>
                        </div>
                        <div className="mr-3">
                          <div className="text-sm font-medium text-gray-900">
                            {request.first_name} {request.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 ml-1" />
                        {request.country_of_residence || request.country}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Globe className="w-4 h-4 text-gray-400 ml-1" />
                        {request.nationality || '-'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <GraduationCap className="w-4 h-4 text-gray-400 ml-1" />
                        {request.specialization || '-'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.interests && request.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {request.interests
                              .slice(0, 2)
                              .map((interest, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                >
                                  {interest}
                                </span>
                              ))}
                            {request.interests.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{request.interests.length - 2} أخرى
                              </span>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Heart className="w-4 h-4 text-gray-400 ml-1" />
                        {request.marital_status || '-'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 ml-1" />
                        {formatDate(request.created_at)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default JoinRequestsDashboard;
