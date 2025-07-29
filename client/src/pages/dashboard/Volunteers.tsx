import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  UserPlus,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { api } from '../../services/api';

interface Volunteer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country: string;
  skills?: string;
  interests?: string;
  availability?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  total_hours?: number;
  total_certificates?: number;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

interface VolunteerStats {
  total_volunteers: number;
  approved_volunteers: number;
  pending_volunteers: number;
  rejected_volunteers: number;
  total_hours: number;
  total_certificates: number;
}

const Volunteers: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddHoursModal, setShowAddHoursModal] = useState(false);
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // جلب المتطوعين
  const { data: volunteers, isLoading } = useQuery({
    queryKey: ['volunteers'],
    queryFn: () => api.get('/volunteers').then((res) => res.data),
  });

  // جلب إحصائيات المتطوعين
  const { data: stats } = useQuery({
    queryKey: ['volunteer-stats'],
    queryFn: () =>
      api.get('/volunteers/stats/overview').then((res) => res.data),
  });

  // تحديث حالة المتطوع
  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: number;
      status: string;
      notes?: string;
    }) => api.put(`/volunteers/${id}/status`, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      queryClient.invalidateQueries({ queryKey: ['volunteer-stats'] });
      setSuccess('تم تحديث حالة المتطوع بنجاح');
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'حدث خطأ أثناء تحديث الحالة');
    },
  });

  // إضافة ساعات تطوع
  const addHoursMutation = useMutation({
    mutationFn: ({ volunteerId, data }: { volunteerId: number; data: any }) =>
      api.post(`/volunteers/${volunteerId}/hours`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      setSuccess('تم إضافة ساعات التطوع بنجاح');
      setShowAddHoursModal(false);
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'حدث خطأ أثناء إضافة الساعات');
    },
  });

  // إضافة شهادة تطوع
  const addCertificateMutation = useMutation({
    mutationFn: ({ volunteerId, data }: { volunteerId: number; data: any }) =>
      api.post(`/volunteers/${volunteerId}/certificates`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      setSuccess('تم إضافة الشهادة بنجاح');
      setShowAddCertificateModal(false);
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'حدث خطأ أثناء إضافة الشهادة');
    },
  });

  const filteredVolunteers =
    volunteers?.data?.filter((volunteer: Volunteer) => {
      const matchesSearch =
        volunteer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || volunteer.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: 'قيد المراجعة', class: 'bg-yellow-100 text-yellow-800' },
      approved: { text: 'مقبول', class: 'bg-green-100 text-green-800' },
      rejected: { text: 'مرفوض', class: 'bg-red-100 text-red-800' },
      suspended: { text: 'معلق', class: 'bg-gray-100 text-gray-800' },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.text}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'suspended':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStatusUpdate = (volunteerId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      id: volunteerId,
      status: newStatus,
      notes: `تم تحديث الحالة إلى ${newStatus}`,
    });
  };

  const handleAddHours = (volunteerId: number, data: any) => {
    addHoursMutation.mutate({ volunteerId, data });
  };

  const handleAddCertificate = (volunteerId: number, data: any) => {
    addCertificateMutation.mutate({ volunteerId, data });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">إدارة المتطوعين</h1>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          إضافة متطوع جديد
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" title="خطأ">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="default" title="نجح">
          {success}
        </Alert>
      )}

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي المتطوعين
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.data?.total_volunteers || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المقبولون</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.data?.approved_volunteers || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الساعات
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats?.data?.total_hours || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الشهادات</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats?.data?.total_certificates || 0}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في المتطوعين..."
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">مقبول</option>
                <option value="rejected">مرفوض</option>
                <option value="suspended">معلق</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المتطوعين */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المتطوعين ({filteredVolunteers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium">الاسم</th>
                  <th className="text-right py-3 px-4 font-medium">
                    البريد الإلكتروني
                  </th>
                  <th className="text-right py-3 px-4 font-medium">البلد</th>
                  <th className="text-right py-3 px-4 font-medium">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium">الساعات</th>
                  <th className="text-right py-3 px-4 font-medium">
                    تاريخ التسجيل
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map((volunteer: Volunteer) => (
                  <tr
                    key={volunteer.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {volunteer.first_name} {volunteer.last_name}
                        </p>
                        {volunteer.phone && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {volunteer.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {volunteer.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {volunteer.country}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(volunteer.status)}
                        {getStatusBadge(volunteer.status)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">
                          {volunteer.total_hours || 0}
                        </span>
                        <span className="text-sm text-gray-500">ساعة</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(volunteer.created_at)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVolunteer(volunteer);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVolunteer(volunteer);
                            setShowAddHoursModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <select
                          value={volunteer.status}
                          onChange={(e) =>
                            handleStatusUpdate(volunteer.id, e.target.value)
                          }
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="pending">قيد المراجعة</option>
                          <option value="approved">مقبول</option>
                          <option value="rejected">مرفوض</option>
                          <option value="suspended">معلق</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* نافذة تفاصيل المتطوع */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`تفاصيل المتطوع: ${selectedVolunteer?.first_name} ${selectedVolunteer?.last_name}`}
      >
        {selectedVolunteer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  الاسم الكامل
                </label>
                <p className="text-gray-900">
                  {selectedVolunteer.first_name} {selectedVolunteer.last_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <p className="text-gray-900">{selectedVolunteer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
                <p className="text-gray-900">
                  {selectedVolunteer.phone || 'غير محدد'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  البلد
                </label>
                <p className="text-gray-900">{selectedVolunteer.country}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  المهارات
                </label>
                <p className="text-gray-900">
                  {selectedVolunteer.skills || 'غير محدد'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  الاهتمامات
                </label>
                <p className="text-gray-900">
                  {selectedVolunteer.interests || 'غير محدد'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowAddHoursModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة ساعات
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowAddCertificateModal(true);
                }}
              >
                <Award className="w-4 h-4 mr-2" />
                إضافة شهادة
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* نافذة إضافة ساعات التطوع */}
      <Modal
        isOpen={showAddHoursModal}
        onClose={() => setShowAddHoursModal(false)}
        title="إضافة ساعات التطوع"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddHours(selectedVolunteer!.id, {
              date: formData.get('date'),
              start_time: formData.get('start_time'),
              end_time: formData.get('end_time'),
              total_hours: formData.get('total_hours'),
              activity_description: formData.get('activity_description'),
              supervisor_name: formData.get('supervisor_name'),
            });
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">التاريخ *</label>
              <Input name="date" type="date" required />
            </div>
            <div>
              <label className="block text-sm font-medium">عدد الساعات *</label>
              <Input
                name="total_hours"
                type="number"
                step="0.5"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">وقت البداية</label>
              <Input name="start_time" type="time" />
            </div>
            <div>
              <label className="block text-sm font-medium">وقت النهاية</label>
              <Input name="end_time" type="time" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">وصف النشاط *</label>
            <textarea
              name="activity_description"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">اسم المشرف</label>
            <Input name="supervisor_name" />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddHoursModal(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={addHoursMutation.isPending}>
              {addHoursMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'إضافة الساعات'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* نافذة إضافة شهادة التطوع */}
      <Modal
        isOpen={showAddCertificateModal}
        onClose={() => setShowAddCertificateModal(false)}
        title="إضافة شهادة التطوع"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddCertificate(selectedVolunteer!.id, {
              title: formData.get('title'),
              description: formData.get('description'),
              total_hours: formData.get('total_hours'),
              issue_date: formData.get('issue_date'),
              expiry_date: formData.get('expiry_date'),
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">عنوان الشهادة *</label>
            <Input name="title" required />
          </div>

          <div>
            <label className="block text-sm font-medium">وصف الشهادة</label>
            <textarea
              name="description"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                إجمالي الساعات *
              </label>
              <Input
                name="total_hours"
                type="number"
                step="0.5"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                تاريخ الإصدار *
              </label>
              <Input name="issue_date" type="date" required />
            </div>
            <div>
              <label className="block text-sm font-medium">
                تاريخ الانتهاء
              </label>
              <Input name="expiry_date" type="date" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddCertificateModal(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={addCertificateMutation.isPending}>
              {addCertificateMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                'إضافة الشهادة'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Volunteers;
