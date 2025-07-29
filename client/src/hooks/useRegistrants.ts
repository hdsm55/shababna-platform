import React, { useState, useCallback, useEffect } from 'react';
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
  const [users, setUsers] = useState<Registrant[]>([]);
  const [events, setEvents] = useState<Registrant[]>([]);
  const [programs, setPrograms] = useState<Registrant[]>([]);
  const [joins, setJoins] = useState<Registrant[]>([]);
  // const [newsletter, setNewsletter] = useState<Registrant[]>([]); // مؤجل
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // عضوية
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
      // فعاليات
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
      // برامج
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
      // انضمام
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
      // نشرة بريدية (مؤجل)
      // if (fetchNewsletterSubscribers) {
      //   const newsletterRes = await fetchNewsletterSubscribers();
      //   setNewsletter((newsletterRes?.data?.items || []).map((n: any) => ({
      //     id: `newsletter-${n.id}`,
      //     name: n.first_name ? `${n.first_name} ${n.last_name || ''}`.trim() : n.email,
      //     email: n.email,
      //     phone: n.phone,
      //     source: 'نشرة بريدية',
      //     sourceDetails: '-',
      //     registeredAt: n.created_at || '',
      //   })));
      // }
    } catch (err) {
      setError('حدث خطأ أثناء جلب بيانات المسجلين');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { users, events, programs, joins, loading, error, refetch: fetchAll };
}