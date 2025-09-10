import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Alert from '../../../components/common/Alert';
import SEO from '../../../components/common/SEO';
import {
  fetchEventById,
  updateEvent,
  deleteEvent,
} from '../../../services/eventsApi';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
  Download,
  Share2,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';

interface EventRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  registeredAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const DashboardEventDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isRTL = i18n.dir() === 'rtl';

  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    start_date: '',
    end_date: '',
    max_attendees: '',
    status: '',
  });

  // جلب تفاصيل الفعالية
  const {
    data: eventData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
  });

  const event = eventData?.data || eventData;

  // جلب تسجيلات الفعالية
  const { data: registrationsData } = useQuery({
    queryKey: ['event-registrations', id],
    queryFn: () =>
      fetch(`/api/forms/event-registrations?event_id=${id}`).then((res) =>
        res.json()
      ),
    enabled: !!id,
  });

  // تحديث الفعالية
  const updateEventMutation = useMutation({
    mutationFn: (data: any) => updateEvent(parseInt(id!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-event', id] });
      setShowEditModal(false);
    },
  });

  // حذف الفعالية
  const deleteEventMutation = useMutation({
    mutationFn: () => deleteEvent(parseInt(id!)),
    onSuccess: () => {
      navigate('/dashboard/events');
    },
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEventMutation.mutate(editForm);
  };

  const handleDelete = () => {
    deleteEventMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getRegistrationPercentage = (registered: number, capacity: number) => {
    if (!capacity) return 0;
    return Math.min((registered / capacity) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return t('eventDetail.status.upcoming', 'قادمة');
      case 'active':
        return t('eventDetail.status.active', 'نشطة');
      case 'completed':
        return t('eventDetail.status.completed', 'مكتملة');
      case 'cancelled':
        return t('eventDetail.status.cancelled', 'ملغية');
      default:
        return t('eventDetail.status.unknown', 'غير محدد');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !event) {
    return (
      <DashboardLayout>
        <Alert
          type="error"
          title={t('eventDetail.error.title', 'خطأ في تحميل الفعالية')}
        >
          {t('eventDetail.error.message', 'حدث خطأ أثناء جلب تفاصيل الفعالية.')}
        </Alert>
      </DashboardLayout>
    );
  }

  const registrations = registrationsData?.data?.registrations || [];

  return (
    <DashboardLayout>
      <SEO
        title={`${event.title} - لوحة التحكم`}
        description={`تفاصيل الفعالية: ${event.title}`}
        type="website"
      />

      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-sm border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/dashboard/events">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    {t('eventDetail.backToEvents', 'العودة إلى الفعاليات')}
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {event.title}
                  </h1>
                  <p className="text-gray-600">
                    {t('eventDetail.subtitle', 'تفاصيل الفعالية والإحصائيات')}
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{t('eventDetail.edit', 'تعديل')}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('eventDetail.delete', 'حذف')}</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('eventDetail.stats.registrations', 'المسجلون')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {registrations.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('eventDetail.stats.capacity', 'السعة')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {event.max_attendees || 'غير محدد'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('eventDetail.stats.occupancy', 'نسبة الإشغال')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getRegistrationPercentage(
                      registrations.length,
                      event.max_attendees || 0
                    )}
                    %
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('eventDetail.stats.status', 'الحالة')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getStatusText(event.status)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {t('eventDetail.progress.title', 'تقدم التسجيل')}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {registrations.length} / {event.max_attendees || 'غير محدد'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${getRegistrationPercentage(
                        registrations.length,
                        event.max_attendees || 0
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    {
                      id: 'overview',
                      label: t('eventDetail.tabs.overview', 'نظرة عامة'),
                      icon: Eye,
                    },
                    {
                      id: 'registrations',
                      label: t('eventDetail.tabs.registrations', 'المسجلون'),
                      icon: Users,
                    },
                    {
                      id: 'details',
                      label: t('eventDetail.tabs.details', 'التفاصيل'),
                      icon: Info,
                    },
                    {
                      id: 'analytics',
                      label: t('eventDetail.tabs.analytics', 'التحليلات'),
                      icon: BarChart3,
                    },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {t('eventDetail.overview.details', 'تفاصيل الفعالية')}
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">
                                {t(
                                  'eventDetail.overview.startDate',
                                  'تاريخ البداية'
                                )}
                              </p>
                              <p className="font-medium">
                                {formatDate(event.start_date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">
                                {t(
                                  'eventDetail.overview.endDate',
                                  'تاريخ النهاية'
                                )}
                              </p>
                              <p className="font-medium">
                                {formatDate(event.end_date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">
                                {t('eventDetail.overview.location', 'الموقع')}
                              </p>
                              <p className="font-medium">{event.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">
                                {t('eventDetail.overview.category', 'الفئة')}
                              </p>
                              <p className="font-medium">{event.category}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {t('eventDetail.overview.description', 'الوصف')}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'registrations' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {t(
                          'eventDetail.registrations.title',
                          'المسجلون في الفعالية'
                        )}
                      </h3>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        {t('eventDetail.registrations.export', 'تصدير')}
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('eventDetail.registrations.name', 'الاسم')}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t(
                                'eventDetail.registrations.email',
                                'البريد الإلكتروني'
                              )}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('eventDetail.registrations.phone', 'الهاتف')}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t(
                                'eventDetail.registrations.date',
                                'تاريخ التسجيل'
                              )}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('eventDetail.registrations.status', 'الحالة')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {registrations.map(
                            (registration: EventRegistration) => (
                              <tr key={registration.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {registration.firstName}{' '}
                                    {registration.lastName}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {registration.email}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {registration.phone || '-'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {formatDate(registration.registeredAt)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                      registration.status
                                    )}`}
                                  >
                                    {registration.status}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h4 className="text-lg font-semibold mb-4">
                          {t('eventDetail.details.contact', 'معلومات التواصل')}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-600">
                              events@shababna.com
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-600">
                              +90 505 050 56 45
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-600">
                              www.shababna.com
                            </span>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-6">
                        <h4 className="text-lg font-semibold mb-4">
                          {t('eventDetail.details.requirements', 'المتطلبات')}
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-600">
                              {t(
                                'eventDetail.details.registration',
                                'التسجيل المسبق مطلوب'
                              )}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-600">
                              {t(
                                'eventDetail.details.attendance',
                                'الحضور في الوقت المحدد'
                              )}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-600">
                              {t(
                                'eventDetail.details.etiquette',
                                'الالتزام بآداب الحضور'
                              )}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t('eventDetail.analytics.title', 'تحليلات الفعالية')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h4 className="text-lg font-semibold mb-4">
                          {t(
                            'eventDetail.analytics.registration',
                            'معدل التسجيل'
                          )}
                        </h4>
                        <div className="text-3xl font-bold text-blue-600">
                          {registrations.length}
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('eventDetail.analytics.registrants', 'مسجل')}
                        </p>
                      </Card>
                      <Card className="p-6">
                        <h4 className="text-lg font-semibold mb-4">
                          {t('eventDetail.analytics.occupancy', 'معدل الإشغال')}
                        </h4>
                        <div className="text-3xl font-bold text-green-600">
                          {getRegistrationPercentage(
                            registrations.length,
                            event.max_attendees || 0
                          )}
                          %
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('eventDetail.analytics.ofCapacity', 'من السعة')}
                        </p>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">
              {t('eventDetail.edit.title', 'تعديل الفعالية')}
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input
                name="title"
                placeholder={t(
                  'eventDetail.edit.titlePlaceholder',
                  'عنوان الفعالية'
                )}
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                required
              />
              <textarea
                name="description"
                placeholder={t(
                  'eventDetail.edit.descriptionPlaceholder',
                  'وصف الفعالية'
                )}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                required
              />
              <Input
                name="location"
                placeholder={t(
                  'eventDetail.edit.locationPlaceholder',
                  'موقع الفعالية'
                )}
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                required
              />
              <Input
                name="category"
                placeholder={t(
                  'eventDetail.edit.categoryPlaceholder',
                  'فئة الفعالية'
                )}
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value })
                }
                required
              />
              <Input
                name="max_attendees"
                type="number"
                placeholder={t(
                  'eventDetail.edit.maxAttendeesPlaceholder',
                  'العدد الأقصى للمشاركين'
                )}
                value={editForm.max_attendees}
                onChange={(e) =>
                  setEditForm({ ...editForm, max_attendees: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="start_date"
                  type="date"
                  placeholder={t(
                    'eventDetail.edit.startDatePlaceholder',
                    'تاريخ البداية'
                  )}
                  value={editForm.start_date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, start_date: e.target.value })
                  }
                  required
                />
                <Input
                  name="end_date"
                  type="date"
                  placeholder={t(
                    'eventDetail.edit.endDatePlaceholder',
                    'تاريخ النهاية'
                  )}
                  value={editForm.end_date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, end_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  {t('eventDetail.edit.cancel', 'إلغاء')}
                </Button>
                <Button
                  type="submit"
                  disabled={updateEventMutation.isPending}
                  className="flex-1"
                >
                  {updateEventMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    t('eventDetail.edit.save', 'حفظ التغييرات')
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">
                {t('eventDetail.delete.title', 'حذف الفعالية')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t(
                  'eventDetail.delete.message',
                  'هل أنت متأكد من حذف هذه الفعالية؟ هذا الإجراء لا يمكن التراجع عنه.'
                )}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  {t('eventDetail.delete.cancel', 'إلغاء')}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deleteEventMutation.isPending}
                  className="flex-1"
                >
                  {deleteEventMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    t('eventDetail.delete.confirm', 'حذف')
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardEventDetail;
