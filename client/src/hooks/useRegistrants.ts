import React, { useState, useCallback, useEffect, useMemo } from 'react';
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

// Cache for registrants data
const registrantsCache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export function useRegistrants() {
  const [users, setUsers] = useState<Registrant[]>([]);
  const [events, setEvents] = useState<Registrant[]>([]);
  const [programs, setPrograms] = useState<Registrant[]>([]);
  const [joins, setJoins] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized data processing functions
  const processUsers = useCallback((data: any[]) => {
    return data.map((u: any) => ({
      id: `user-${u.id}`,
      name: `${u.first_name || u.firstName || ''} ${u.last_name || u.lastName || ''}`.trim(),
      email: u.email,
      phone: u.phone,
      source: 'عضوية',
      sourceDetails: '-',
      registeredAt: u.created_at || u.joinDate || '',
    }));
  }, []);

  const processEvents = useCallback((data: any[]) => {
    return data.map((r: any) => ({
      id: `event-${r.id}`,
      name: r.user_name || `${r.first_name || ''} ${r.last_name || ''}`.trim(),
      email: r.user_email || r.email,
      phone: r.phone,
      source: 'فعالية',
      sourceDetails: r.event_title || r.event?.title || '-',
      registeredAt: r.created_at || r.registered_at || '',
    }));
  }, []);

  const processPrograms = useCallback((data: any[]) => {
    return data.map((r: any) => ({
      id: `program-${r.id}`,
      name: r.user_name || `${r.first_name || ''} ${r.last_name || ''}`.trim(),
      email: r.user_email || r.email,
      phone: r.phone,
      source: 'برنامج',
      sourceDetails: r.program_title || r.program?.title || '-',
      registeredAt: r.created_at || r.registered_at || '',
    }));
  }, []);

  const processJoins = useCallback((data: any[]) => {
    return data.map((j: any) => ({
      id: `join-${j.id}`,
      name: `${j.first_name || ''} ${j.last_name || ''}`.trim(),
      email: j.email,
      phone: j.phone,
      source: 'انضمام',
      sourceDetails: j.country || '-',
      registeredAt: j.created_at || '',
    }));
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = 'registrants-all';
      const cached = registrantsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setUsers(cached.data.users);
        setEvents(cached.data.events);
        setPrograms(cached.data.programs);
        setJoins(cached.data.joins);
        setLoading(false);
        return;
      }

      // Fetch all data in parallel for better performance
      const [usersRes, eventsRes, programsRes, joinRes] = await Promise.allSettled([
        fetchUsers(),
        fetchEventRegistrations(),
        fetchProgramRegistrations(),
        fetchJoinRequests()
      ]);

      // Process users
      if (usersRes.status === 'fulfilled') {
        const processedUsers = processUsers((usersRes.value?.data?.items || []));
        setUsers(processedUsers);
      }

      // Process events
      if (eventsRes.status === 'fulfilled') {
        const processedEvents = processEvents((eventsRes.value?.data?.registrations || []));
        setEvents(processedEvents);
      }

      // Process programs
      if (programsRes.status === 'fulfilled') {
        const processedPrograms = processPrograms((programsRes.value?.data?.registrations || []));
        setPrograms(processedPrograms);
      }

      // Process joins
      if (joinRes.status === 'fulfilled') {
        const processedJoins = processJoins((joinRes.value?.data?.requests || []));
        setJoins(processedJoins);
      }

      // Cache the results
      registrantsCache.set(cacheKey, {
        data: {
          users: usersRes.status === 'fulfilled' ? processUsers((usersRes.value?.data?.items || [])) : [],
          events: eventsRes.status === 'fulfilled' ? processEvents((eventsRes.value?.data?.registrations || [])) : [],
          programs: programsRes.status === 'fulfilled' ? processPrograms((programsRes.value?.data?.registrations || [])) : [],
          joins: joinRes.status === 'fulfilled' ? processJoins((joinRes.value?.data?.requests || [])) : [],
        },
        timestamp: Date.now(),
      });

    } catch (err) {
      setError('حدث خطأ أثناء جلب بيانات المسجلين');
      console.error('Registrants fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [processUsers, processEvents, processPrograms, processJoins]);

  // Memoized combined data
  const allRegistrants = useMemo(() => {
    return [...users, ...events, ...programs, ...joins];
  }, [users, events, programs, joins]);

  // Memoized statistics
  const statistics = useMemo(() => {
    return {
      total: allRegistrants.length,
      users: users.length,
      events: events.length,
      programs: programs.length,
      joins: joins.length,
    };
  }, [allRegistrants, users, events, programs, joins]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Clear cache function
  const clearCache = useCallback(() => {
    registrantsCache.clear();
  }, []);

  return {
    users,
    events,
    programs,
    joins,
    allRegistrants,
    statistics,
    loading,
    error,
    refetch: fetchAll,
    clearCache
  };
}