import React, { useState, useCallback, useEffect } from 'react';
import { fetchUsers, fetchEventRegistrations, fetchProgramRegistrations, fetchJoinRequests, fetchProgramSupporters, fetchNewsletterSubscribers } from '../services/dashboardApi';

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
  const [users, setUsers] = useState<Registrant[]>([]);
  const [events, setEvents] = useState<Registrant[]>([]);
  const [programs, setPrograms] = useState<Registrant[]>([]);
  const [supporters, setSupporters] = useState<Registrant[]>([]);
  const [joins, setJoins] = useState<Registrant[]>([]);
  const [newsletter, setNewsletter] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // عضوية
      try {
        const usersRes = await fetchUsers();
        console.log('users:', JSON.stringify(usersRes, null, 2));
        setUsers((usersRes?.data?.items || []).map((u: any) => ({
          id: `user-${u.id}`,
          name: `${u.first_name || u.firstName || ''} ${u.last_name || u.lastName || ''}`.trim(),
          email: u.email,
          phone: u.phone,
          source: 'عضوية',
          sourceDetails: '-',
          registeredAt: u.created_at || u.joinDate || '',
        })));
      } catch (err) {
        console.error('خطأ في جلب المستخدمين:', err);
        setUsers([]);
      }

      // فعاليات
      try {
        const eventsRes = await fetchEventRegistrations();
        console.log('event registrations:', JSON.stringify(eventsRes, null, 2));
        setEvents((eventsRes?.data?.registrations || []).map((r: any) => ({
          id: `event-${r.id}`,
          name: r.user_name || `${r.first_name || ''} ${r.last_name || ''}`.trim(),
          email: r.user_email || r.email,
          phone: r.phone,
          source: 'فعالية',
          sourceDetails: r.event_title || r.event?.title || '-',
          registeredAt: r.created_at || r.registered_at || '',
        })));
      } catch (err) {
        console.error('خطأ في جلب تسجيلات الفعاليات:', err);
        setEvents([]);
      }

      // برامج (تسجيلات)
      try {
        const programsRes = await fetchProgramRegistrations();
        console.log('program registrations:', JSON.stringify(programsRes, null, 2));
        setPrograms((programsRes?.data?.registrations || []).map((r: any) => ({
          id: `program-${r.id}`,
          name: r.user_name || `${r.first_name || ''} ${r.last_name || ''}`.trim(),
          email: r.user_email || r.email,
          phone: r.phone,
          source: 'برنامج',
          sourceDetails: r.program_title || r.program?.title || '-',
          registeredAt: r.created_at || r.registered_at || '',
        })));
      } catch (err) {
        console.error('خطأ في جلب تسجيلات البرامج:', err);
        setPrograms([]);
      }

      // داعمين البرامج
      try {
        const supportersRes = await fetchProgramSupporters();
        console.log('program supporters:', JSON.stringify(supportersRes, null, 2));
        setSupporters((supportersRes?.data?.supporters || []).map((s: any) => ({
          id: `supporter-${s.id}`,
          name: s.supporter_name || '-',
          email: s.supporter_email || '-',
          phone: s.supporter_phone || '-',
          source: 'تبرع',
          sourceDetails: s.program_title || s.program?.title || '-',
          registeredAt: s.created_at || '',
          amount: s.amount,
          supportType: s.support_type,
          message: s.message,
          status: s.status,
        })));
      } catch (err) {
        console.error('خطأ في جلب داعمي البرامج:', err);
        setSupporters([]);
      }

      // انضمام
      try {
        const joinRes = await fetchJoinRequests();
        console.log('join requests:', JSON.stringify(joinRes, null, 2));
        console.log('join requests data structure:', joinRes?.data);
        console.log('join requests array:', joinRes?.data?.requests);
        console.log('join requests length:', joinRes?.data?.requests?.length);

        if (joinRes?.data?.requests) {
          setJoins((joinRes.data.requests || []).map((j: any) => ({
            id: `join-${j.id}`,
            name: `${j.first_name || ''} ${j.last_name || ''}`.trim(),
            email: j.email,
            phone: j.phone,
            source: 'انضمام',
            sourceDetails: j.country || '-',
            registeredAt: j.created_at || '',
            age: j.age,
            interests: j.interests,
            motivation: j.motivation,
            country: j.country,
            status: j.status,
          })));
        } else {
          console.log('❌ لا توجد بيانات طلبات انضمام في الاستجابة');
          setJoins([]);
        }
      } catch (err) {
        console.error('خطأ في جلب طلبات الانضمام:', err);
        setJoins([]);
      }

      // نشرة بريدية
      try {
        const newsletterRes = await fetchNewsletterSubscribers();
        console.log('newsletter subscribers:', JSON.stringify(newsletterRes, null, 2));
        setNewsletter((newsletterRes?.data?.subscribers || []).map((n: any) => ({
          id: `newsletter-${n.id}`,
          name: n.first_name ? `${n.first_name} ${n.last_name || ''}`.trim() : n.email,
          email: n.email,
          phone: '-',
          source: 'نشرة بريدية',
          sourceDetails: n.status || 'active',
          registeredAt: n.subscribed_at || '',
          status: n.status,
        })));
      } catch (err) {
        console.error('خطأ في جلب مشتركي النشرة البريدية:', err);
        setNewsletter([]);
      }

    } catch (err) {
      console.error('خطأ عام في جلب البيانات:', err);
      setError('حدث خطأ أثناء جلب بيانات المسجلين');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { users, events, programs, supporters, joins, newsletter, loading, error, refetch: fetchAll };
}