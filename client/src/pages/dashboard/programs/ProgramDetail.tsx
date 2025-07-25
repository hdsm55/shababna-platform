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
import { fetchProgramById, updateProgram } from '../../../services/programsApi';
import { deleteProgram } from '../../../services/dashboardApi';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Users,
  TrendingUp,
  Target,
  Award,
  Clock,
  MapPin,
  DollarSign,
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
} from 'lucide-react';

interface ProgramRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  registeredAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface ProgramSupporter {
  id: string;
  supporterName: string;
  supporterEmail: string;
  amount: number;
  note?: string;
  supportedAt: string;
}

const DashboardProgramDetail: React.FC = () => {
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
    category: '',
    goal_amount: '',
    start_date: '',
    end_date: '',
  });

  // جلب تفاصيل البرنامج
  const {
    data: programData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-program', id],
    queryFn: () => fetchProgramById(id!),
    enabled: !!id,
  });

  const program = programData?.data || programData;

  // جلب تسجيلات البرنامج
  const { data: registrationsData } = useQuery({
    queryKey: ['program-registrations', id],
    queryFn: () =>
      fetch(`/api/forms/program-registrations?program_id=${id}`).then((res) =>
        res.json()
      ),
    enabled: !!id,
  });

  // جلب داعمي البرنامج
  const { data: supportersData } = useQuery({
    queryKey: ['program-supporters', id],
    queryFn: () =>
      fetch(`/api/programs/${id}/supporters`).then((res) => res.json()),
    enabled: !!id,
  });

  // تحديث البرنامج
  const updateProgramMutation = useMutation({
    mutationFn: (data: any) => updateProgram(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-program', id] });
      setShowEditModal(false);
    },
  });

  // حذف البرنامج
  const deleteProgramMutation = useMutation({
    mutationFn: () => deleteProgram(id!),
    onSuccess: () => {
      navigate('/dashboard/programs');
    },
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProgramMutation.mutate(editForm);
  };

  const handleDelete = () => {
    deleteProgramMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'غير محدد';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  if (error || !program) {
    return (
      <DashboardLayout>
        <Alert
          type="error"
          title={t('programDetail.error.title', 'خطأ في تحميل البرنامج')}
        >
          {t(
            'programDetail.error.message',
            'حدث خطأ أثناء جلب تفاصيل البرنامج.'
          )}
        </Alert>
      </DashboardLayout>
    );
  }

  const registrations = registrationsData?.data?.registrations || [];
  const supporters = supportersData?.data?.supporters || [];

  return (
    <DashboardLayout>
      <SEO
        title={`${program.title} - لوحة التحكم`}
        description={`تفاصيل البرنامج: ${program.title}`}
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
                <Link to="/dashboard/programs">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>
                      {t('programDetail.backToPrograms', 'العودة إلى البرامج')}
                    </span>
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {program.title}
                  </h1>
                  <p className="text-gray-600">
                    {t('programDetail.subtitle', 'تفاصيل البرنامج والإحصائيات')}
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
                  <span>{t('programDetail.edit', 'تعديل')}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('programDetail.delete', 'حذف')}</span>
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
                    {t('programDetail.stats.participants', 'المشاركون')}
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
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('programDetail.stats.currentAmount', 'المبلغ المحصل')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(program.current_amount || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('programDetail.stats.goalAmount', 'الهدف')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(program.goal_amount || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('programDetail.stats.progress', 'التقدم')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getProgressPercentage(
                      program.current_amount || 0,
                      program.goal_amount || 1
                    )}
                    %
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
                    {t('programDetail.progress.title', 'تقدم البرنامج')}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(program.current_amount || 0)} /{' '}
                    {formatCurrency(program.goal_amount || 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${getProgressPercentage(
                        program.current_amount || 0,
                        program.goal_amount || 1
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
                      label: t('programDetail.tabs.overview', 'نظرة عامة'),
                      icon: Eye,
                    },
                    {
                      id: 'registrations',
                      label: t('programDetail.tabs.registrations', 'المسجلون'),
                      icon: Users,
                    },
                    {
                      id: 'supporters',
                      label: t('programDetail.tabs.supporters', 'الداعمون'),
                      icon: DollarSign,
                    },
                    {
                      id: 'analytics',
                      label: t('programDetail.tabs.analytics', 'التحليلات'),
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
                          {t(
                            'programDetail.overview.details',
                            'تفاصيل البرنامج'
                          )}
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">
                                {t(
                                  'programDetail.overview.startDate',
                                  'تاريخ البداية'
                                )}
                              </p>
                              <p className="font-medium">
                                {formatDate(program.start_date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">
                                {t(
                                  'programDetail.overview.endDate',
                                  'تاريخ النهاية'
                                )}
                              </p>
                              <p className="font-medium">
                                {formatDate(program.end_date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Target className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-600">
                                {t('programDetail.overview.category', 'الفئة')}
                              </p>
                              <p className="font-medium">{program.category}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {t('programDetail.overview.description', 'الوصف')}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {program.description}
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
                          'programDetail.registrations.title',
                          'المسجلون في البرنامج'
                        )}
                      </h3>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        {t('programDetail.registrations.export', 'تصدير')}
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('programDetail.registrations.name', 'الاسم')}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t(
                                'programDetail.registrations.email',
                                'البريد الإلكتروني'
                              )}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('programDetail.registrations.phone', 'الهاتف')}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t(
                                'programDetail.registrations.date',
                                'تاريخ التسجيل'
                              )}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t(
                                'programDetail.registrations.status',
                                'الحالة'
                              )}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {registrations.map(
                            (registration: ProgramRegistration) => (
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

                {activeTab === 'supporters' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {t('programDetail.supporters.title', 'داعمو البرنامج')}
                      </h3>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        {t('programDetail.supporters.export', 'تصدير')}
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('programDetail.supporters.name', 'الاسم')}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t(
                                'programDetail.supporters.email',
                                'البريد الإلكتروني'
                              )}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('programDetail.supporters.amount', 'المبلغ')}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t(
                                'programDetail.supporters.date',
                                'تاريخ الدعم'
                              )}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('programDetail.supporters.note', 'ملاحظة')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {supporters.map((supporter: ProgramSupporter) => (
                            <tr key={supporter.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {supporter.supporterName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {supporter.supporterEmail}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatCurrency(supporter.amount)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {formatDate(supporter.supportedAt)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {supporter.note || '-'}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t('programDetail.analytics.title', 'تحليلات البرنامج')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h4 className="text-lg font-semibold mb-4">
                          {t(
                            'programDetail.analytics.participation',
                            'معدل المشاركة'
                          )}
                        </h4>
                        <div className="text-3xl font-bold text-blue-600">
                          {registrations.length}
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('programDetail.analytics.participants', 'مشارك')}
                        </p>
                      </Card>
                      <Card className="p-6">
                        <h4 className="text-lg font-semibold mb-4">
                          {t('programDetail.analytics.funding', 'معدل التمويل')}
                        </h4>
                        <div className="text-3xl font-bold text-green-600">
                          {getProgressPercentage(
                            program.current_amount || 0,
                            program.goal_amount || 1
                          )}
                          %
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('programDetail.analytics.ofGoal', 'من الهدف')}
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
              {t('programDetail.edit.title', 'تعديل البرنامج')}
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input
                name="title"
                placeholder={t(
                  'programDetail.edit.titlePlaceholder',
                  'عنوان البرنامج'
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
                  'programDetail.edit.descriptionPlaceholder',
                  'وصف البرنامج'
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
                name="category"
                placeholder={t(
                  'programDetail.edit.categoryPlaceholder',
                  'فئة البرنامج'
                )}
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value })
                }
                required
              />
              <Input
                name="goal_amount"
                type="number"
                placeholder={t(
                  'programDetail.edit.goalAmountPlaceholder',
                  'المبلغ المستهدف'
                )}
                value={editForm.goal_amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, goal_amount: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="start_date"
                  type="date"
                  placeholder={t(
                    'programDetail.edit.startDatePlaceholder',
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
                    'programDetail.edit.endDatePlaceholder',
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
                  {t('programDetail.edit.cancel', 'إلغاء')}
                </Button>
                <Button
                  type="submit"
                  disabled={updateProgramMutation.isPending}
                  className="flex-1"
                >
                  {updateProgramMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    t('programDetail.edit.save', 'حفظ التغييرات')
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
                {t('programDetail.delete.title', 'حذف البرنامج')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t(
                  'programDetail.delete.message',
                  'هل أنت متأكد من حذف هذا البرنامج؟ هذا الإجراء لا يمكن التراجع عنه.'
                )}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  {t('programDetail.delete.cancel', 'إلغاء')}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deleteProgramMutation.isPending}
                  className="flex-1"
                >
                  {deleteProgramMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    t('programDetail.delete.confirm', 'حذف')
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

export default DashboardProgramDetail;
