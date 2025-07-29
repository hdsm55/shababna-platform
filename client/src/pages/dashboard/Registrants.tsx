import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { Eye } from 'lucide-react';
import {
  fetchUsers,
  fetchEventRegistrations,
  fetchProgramRegistrations,
  fetchJoinRequests,
} from '../../services/dashboardApi';
import { User } from '../../types';
import { useRegistrants } from '../../hooks/useRegistrants';

// نموذج موحد للمسجل
interface Registrant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: 'عضوية' | 'فعالية' | 'برنامج' | 'تبرع' | 'انضمام';
  sourceDetails: string;
  registeredAt: string;
}

const RegistrantsDashboard: React.FC = () => {
  const {
    users,
    events,
    programs,
    joins,
    newsletter,
    loading,
    error,
    refetch,
  } = useRegistrants();
  const [selectedRegistrant, setSelectedRegistrant] = useState<any | null>(
    null
  );

  const renderTable = (title: string, data: any[], type?: string) => (
    <Card className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-right rtl:text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3">الاسم</th>
              <th className="py-2 px-3">البريد الإلكتروني</th>
              <th className="py-2 px-3">الهاتف</th>
              {type === 'join' && <th className="py-2 px-3">الدولة</th>}
              {type === 'join' && <th className="py-2 px-3">العمر</th>}
              {type === 'join' && <th className="py-2 px-3">الاهتمامات</th>}
              {type === 'join' && <th className="py-2 px-3">التحفيز</th>}
              <th className="py-2 px-3">تفاصيل</th>
              <th className="py-2 px-3">تاريخ التسجيل</th>
              <th className="py-2 px-3">عرض</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3 font-medium">{r.name}</td>
                <td className="py-2 px-3">{r.email}</td>
                <td className="py-2 px-3">{r.phone || '-'}</td>
                {type === 'join' && (
                  <td className="py-2 px-3">{r.country || '-'}</td>
                )}
                {type === 'join' && (
                  <td className="py-2 px-3">{r.age || '-'}</td>
                )}
                {type === 'join' && (
                  <td className="py-2 px-3">
                    {Array.isArray(r.interests)
                      ? r.interests.join(', ')
                      : r.interests || '-'}
                  </td>
                )}
                {type === 'join' && (
                  <td className="py-2 px-3">{r.motivation || '-'}</td>
                )}
                <td className="py-2 px-3">{r.sourceDetails}</td>
                <td className="py-2 px-3">
                  {r.registeredAt?.slice(0, 10) || '-'}
                </td>
                <td className="py-2 px-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Eye}
                    onClick={() => setSelectedRegistrant(r)}
                  >
                    عرض
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا يوجد بيانات في هذا القسم.
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 px-2 sm:px-4 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          إدارة جميع المسجلين
        </h1>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Alert type="error" title="خطأ في تحميل البيانات">
            {error}
          </Alert>
        ) : (
          <>
            {renderTable('الأعضاء (عضوية)', users)}
            {/* {renderTable('المسجلون في النشرة البريدية', newsletter)} */}
            {renderTable('المسجلون في الفعاليات', events)}
            {renderTable('المسجلون في البرامج', programs)}
            {renderTable('طلبات الانضمام', joins, 'join')}
          </>
        )}
        {/* نافذة التفاصيل */}
        {selectedRegistrant && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
              <button
                className="absolute top-2 left-2 text-gray-400 hover:text-gray-700"
                onClick={() => setSelectedRegistrant(null)}
                aria-label="إغلاق"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">تفاصيل المسجل</h2>
              <div className="space-y-2">
                <div>
                  <strong>الاسم:</strong> {selectedRegistrant.name}
                </div>
                <div>
                  <strong>البريد الإلكتروني:</strong> {selectedRegistrant.email}
                </div>
                <div>
                  <strong>رقم الهاتف:</strong> {selectedRegistrant.phone || '-'}
                </div>
                <div>
                  <strong>الدولة:</strong> {selectedRegistrant.country || '-'}
                </div>
                <div>
                  <strong>العمر:</strong> {selectedRegistrant.age || '-'}
                </div>
                <div>
                  <strong>الاهتمامات:</strong>{' '}
                  {Array.isArray(selectedRegistrant.interests)
                    ? selectedRegistrant.interests.join(', ')
                    : selectedRegistrant.interests || '-'}
                </div>
                <div>
                  <strong>الدافع:</strong>{' '}
                  {selectedRegistrant.motivation || '-'}
                </div>
                <div>
                  <strong>تفاصيل:</strong> {selectedRegistrant.sourceDetails}
                </div>
                <div>
                  <strong>تاريخ التسجيل:</strong>{' '}
                  {selectedRegistrant.registeredAt?.slice(0, 10) || '-'}
                </div>
                {/* الحقول الإدارية */}
                {selectedRegistrant.id && (
                  <div>
                    <strong>رقم الطلب (ID):</strong> {selectedRegistrant.id}
                  </div>
                )}
                {selectedRegistrant.status && (
                  <div>
                    <strong>الحالة:</strong> {selectedRegistrant.status}
                  </div>
                )}
                {selectedRegistrant.created_at && (
                  <div>
                    <strong>تاريخ الإنشاء:</strong>{' '}
                    {selectedRegistrant.created_at?.slice(0, 10)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegistrantsDashboard;
