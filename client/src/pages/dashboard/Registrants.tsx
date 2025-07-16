import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { Eye } from 'lucide-react';
import {
  fetchUsers,
  fetchEventRegistrations,
  fetchProgramRegistrations,
  fetchDonations,
  fetchJoinRequests,
} from '../../services/dashboardApi';
import { User } from '../../types';

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
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<
    'all' | Registrant['source']
  >('all');
  const [selectedRegistrant, setSelectedRegistrant] =
    useState<Registrant | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // جلب بيانات العضوية
        const usersRes = await fetchUsers();
        const users: Registrant[] = (usersRes?.data?.items || []).map(
          (u: any) => ({
            id: `user-${u.id}`,
            name: `${u.first_name || u.firstName || ''} ${
              u.last_name || u.lastName || ''
            }`.trim(),
            email: u.email,
            phone: u.phone,
            source: 'عضوية',
            sourceDetails: '-',
            registeredAt: u.created_at || u.joinDate || '',
          })
        );
        // جلب تسجيلات الفعاليات
        const eventsRes = await fetchEventRegistrations();
        const events: Registrant[] = (eventsRes?.data?.items || []).map(
          (r: any) => ({
            id: `event-${r.id}`,
            name: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
            email: r.email,
            phone: r.phone,
            source: 'فعالية',
            sourceDetails: r.event_title || r.event?.title || '-',
            registeredAt: r.created_at || r.registered_at || '',
          })
        );
        // جلب تسجيلات البرامج
        const programsRes = await fetchProgramRegistrations();
        const programs: Registrant[] = (programsRes?.data?.items || []).map(
          (r: any) => ({
            id: `program-${r.id}`,
            name: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
            email: r.email,
            phone: r.phone,
            source: 'برنامج',
            sourceDetails: r.program_title || r.program?.title || '-',
            registeredAt: r.created_at || r.registered_at || '',
          })
        );
        // جلب التبرعات
        const donationsRes = await fetchDonations();
        const donations: Registrant[] = (donationsRes?.data?.items || []).map(
          (d: any) => ({
            id: `donation-${d.id}`,
            name: d.donorName || '-',
            email: d.donorEmail || '-',
            phone: d.donorPhone || '-',
            source: 'تبرع',
            sourceDetails: `${d.amount} ${d.currency || ''}`,
            registeredAt: d.date || d.created_at || '',
          })
        );
        // جلب طلبات الانضمام
        const joinRes = await fetchJoinRequests();
        const joins: Registrant[] = (joinRes?.data?.items || []).map(
          (j: any) => ({
            id: `join-${j.id}`,
            name: `${j.first_name || ''} ${j.last_name || ''}`.trim(),
            email: j.email,
            phone: j.phone,
            source: 'انضمام',
            sourceDetails: j.country || '-',
            registeredAt: j.created_at || '',
          })
        );
        // دمج كل المسجلين
        setRegistrants([
          ...users,
          ...events,
          ...programs,
          ...donations,
          ...joins,
        ]);
      } catch (err: any) {
        setError('حدث خطأ أثناء جلب بيانات المسجلين');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // فلترة وبحث
  const filtered = useMemo(() => {
    return registrants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        (r.phone || '').toLowerCase().includes(search.toLowerCase());
      const matchesSource = sourceFilter === 'all' || r.source === sourceFilter;
      return matchesSearch && matchesSource;
    });
  }, [registrants, search, sourceFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 px-2 sm:px-4 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">جميع المسجلين</h1>
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد أو الهاتف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">جميع المصادر</option>
              <option value="عضوية">عضوية</option>
              <option value="فعالية">فعالية</option>
              <option value="برنامج">برنامج</option>
              <option value="تبرع">تبرع</option>
              <option value="انضمام">انضمام</option>
            </select>
          </div>
        </Card>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Alert type="error" title="خطأ في تحميل البيانات">
            {error}
          </Alert>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full text-right rtl:text-right">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3">الاسم</th>
                    <th className="py-2 px-3">البريد الإلكتروني</th>
                    <th className="py-2 px-3">الهاتف</th>
                    <th className="py-2 px-3">مصدر التسجيل</th>
                    <th className="py-2 px-3">تفاصيل المصدر</th>
                    <th className="py-2 px-3">تاريخ التسجيل</th>
                    <th className="py-2 px-3">تفاصيل</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">{r.name}</td>
                      <td className="py-2 px-3">{r.email}</td>
                      <td className="py-2 px-3">{r.phone || '-'}</td>
                      <td className="py-2 px-3">{r.source}</td>
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
              {filtered.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا يوجد مسجلين مطابقين للبحث أو الفلتر.
                </div>
              )}
            </div>
          </Card>
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
                  <strong>الهاتف:</strong> {selectedRegistrant.phone || '-'}
                </div>
                <div>
                  <strong>مصدر التسجيل:</strong> {selectedRegistrant.source}
                </div>
                <div>
                  <strong>تفاصيل المصدر:</strong>{' '}
                  {selectedRegistrant.sourceDetails}
                </div>
                <div>
                  <strong>تاريخ التسجيل:</strong>{' '}
                  {selectedRegistrant.registeredAt?.slice(0, 10) || '-'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegistrantsDashboard;
