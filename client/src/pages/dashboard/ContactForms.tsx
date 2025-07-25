import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  fetchContactForms,
  updateContactFormReadStatus,
} from '../../services/dashboardApi';
import {
  AccessibleSection,
  SkipToContent,
} from '../../components/common/AccessibleComponents';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import {
  MessageCircle,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  RefreshCw,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { Link } from 'react-router-dom';

const ContactForms: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // جلب رسائل التواصل
  const {
    data: contactFormsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['contact-forms', filters],
    queryFn: () => fetchContactForms(filters),
    staleTime: 5 * 60 * 1000,
  });

  // تحديث حالة القراءة
  const updateReadStatusMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      updateContactFormReadStatus(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-forms'] });
    },
  });

  const handleReadStatusToggle = (id: string, currentStatus: boolean) => {
    updateReadStatusMutation.mutate({ id, isRead: !currentStatus });
  };

  const handleViewForm = (form: any) => {
    setSelectedForm(form);
    setModalOpen(true);
    // تحديث حالة القراءة إذا لم تكن مقروءة
    if (!form.is_read) {
      updateReadStatusMutation.mutate({ id: form.id, isRead: true });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read':
        return 'text-green-600 bg-green-50';
      case 'unread':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return CheckCircle;
      case 'unread':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const filteredForms =
    contactFormsData?.data?.forms?.filter(
      (form: any) =>
        form.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (error) {
    return (
      <DashboardLayout>
        <SkipToContent />
        <AccessibleSection>
          <Alert type="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء تحميل رسائل التواصل. يرجى المحاولة مرة أخرى.
          </Alert>
        </AccessibleSection>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-2 md:px-6 py-8">
        <AccessibleSection>
          <Card className="mb-8 shadow-lg rounded-2xl p-6 bg-white border-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {t('dashboard.contactForms.title', 'رسائل التواصل')}
              </h1>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="font-bold text-primary-600 border-primary-300"
                >
                  {t(
                    'dashboard.contactForms.goToContact',
                    'اذهب إلى صفحة تواصل معنا'
                  )}
                </Button>
              </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t(
                      'dashboard.contactForms.searchPlaceholder',
                      'البحث في الرسائل...'
                    )}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value, page: 1 })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">
                    {t('dashboard.contactForms.allStatuses', 'جميع الحالات')}
                  </option>
                  <option value="unread">
                    {t('dashboard.contactForms.unread', 'غير مقروءة')}
                  </option>
                  <option value="read">
                    {t('dashboard.contactForms.read', 'مقروءة')}
                  </option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  onClick={() => {
                    // TODO: Implement export functionality
                  }}
                >
                  {t('dashboard.contactForms.export', 'تصدير')}
                </Button>
              </div>
            </div>

            {/* Contact Forms List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('dashboard.contactForms.noMessages', 'لا توجد رسائل')}
                </h3>
                <p className="text-gray-500">
                  {t(
                    'dashboard.contactForms.noResults',
                    'لم يتم العثور على رسائل تواصل تطابق معايير البحث'
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredForms.map((form: any) => {
                  const StatusIcon = getStatusIcon(
                    form.is_read ? 'read' : 'unread'
                  );
                  return (
                    <div
                      key={form.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        form.is_read ? 'border-l-green-500' : 'border-l-red-500'
                      } bg-gray-50 hover:bg-gray-100 transition-colors`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <Mail className="w-5 h-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900">
                                {form.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {form.email}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>
                                {t('dashboard.contactForms.subject', 'الموضوع')}
                                :
                              </strong>{' '}
                              {form.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(form.created_at).toLocaleDateString(
                                'ar-SA'
                              )}{' '}
                              -{' '}
                              {new Date(form.created_at).toLocaleTimeString(
                                'ar-SA'
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              form.is_read ? 'read' : 'unread'
                            )}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {form.is_read
                              ? t('dashboard.contactForms.read', 'مقروءة')
                              : t(
                                  'dashboard.contactForms.unread',
                                  'غير مقروءة'
                                )}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewForm(form)}
                          >
                            {t('dashboard.contactForms.view', 'عرض')}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleReadStatusToggle(form.id, form.is_read)
                            }
                          >
                            {form.is_read ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {contactFormsData?.data?.pagination && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  عرض{' '}
                  {(contactFormsData.data.pagination.page - 1) *
                    contactFormsData.data.pagination.limit +
                    1}{' '}
                  إلى{' '}
                  {Math.min(
                    contactFormsData.data.pagination.page *
                      contactFormsData.data.pagination.limit,
                    contactFormsData.data.pagination.total
                  )}{' '}
                  من {contactFormsData.data.pagination.total} رسالة
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={contactFormsData.data.pagination.page <= 1}
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                  >
                    السابق
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={
                      contactFormsData.data.pagination.page >=
                      contactFormsData.data.pagination.pages
                    }
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </AccessibleSection>

        {/* Modal for viewing form details */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="تفاصيل الرسالة"
        >
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم
                  </label>
                  <p className="text-sm text-gray-900">{selectedForm.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <p className="text-sm text-gray-900">{selectedForm.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الموضوع
                </label>
                <p className="text-sm text-gray-900">{selectedForm.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الرسالة
                </label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedForm.message}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الإرسال
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedForm.created_at).toLocaleDateString(
                    'ar-SA'
                  )}{' '}
                  -{' '}
                  {new Date(selectedForm.created_at).toLocaleTimeString(
                    'ar-SA'
                  )}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ContactForms;
