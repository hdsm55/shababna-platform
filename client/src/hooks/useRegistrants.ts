import { useState, useCallback } from 'react';
import { fetchUsers, fetchEventRegistrations, fetchProgramRegistrations, fetchJoinRequests } from '../services/dashboardApi';

export interface Registrant {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  sourceDetails: string;
  registeredAt: string;
}

export function useRegistrants() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // جلب بيانات العضوية
      const usersRes = await fetchUsers();
      const users: Registrant[] = (usersRes?.data?.items || []).map((u: any) => ({
        id: `user-${u.id}`,
        name: `${u.first_name || u.firstName || ''} ${u.last_name || u.lastName || ''}`.trim(),
        email: u.email,
        phone: u.phone,
        source: 'عضوية',
        sourceDetails: '-',
        registeredAt: u.created_at || u.joinDate || '',
      }));
      // جلب تسجيلات الفعاليات
      const eventsRes = await fetchEventRegistrations();
      const events: Registrant[] = (eventsRes?.data?.items || []).map((r: any) => ({
        id: `event-${r.id}`,
        name: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
        email: r.email,
        phone: r.phone,
        source: 'فعالية',
        sourceDetails: r.event_title || r.event?.title || '-',
        registeredAt: r.created_at || r.registered_at || '',
      }));
      // جلب تسجيلات البرامج
      const programsRes = await fetchProgramRegistrations();
      const programs: Registrant[] = (programsRes?.data?.items || []).map((r: any) => ({
        id: `program-${r.id}`,
        name: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
        email: r.email,
        phone: r.phone,
        source: 'برنامج',
        sourceDetails: r.program_title || r.program?.title || '-',
        registeredAt: r.created_at || r.registered_at || '',
      }));
      // جلب طلبات الانضمام
      const joinRes = await fetchJoinRequests();
      const joins: Registrant[] = (joinRes?.data?.items || []).map((j: any) => ({
        id: `join-${j.id}`,
        name: `${j.first_name || ''} ${j.last_name || ''}`.trim(),
        email: j.email,
        phone: j.phone,
        source: 'انضمام',
        sourceDetails: j.country || '-',
        registeredAt: j.created_at || '',
      }));
      setRegistrants([...users, ...events, ...programs, ...joins]);
    } catch (err) {
      setError('حدث خطأ أثناء جلب بيانات المسجلين');
    } finally {
      setLoading(false);
    }
  }, []);

  // جلب البيانات عند أول تحميل
  useState(() => {
    fetchAll();
  });

  return { registrants, loading, error, refetch: fetchAll };
}