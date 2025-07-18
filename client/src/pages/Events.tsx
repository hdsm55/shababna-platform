import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Skeleton } from '../components/ui/Skeleton';
import { QuickActions } from '../components/ui/QuickActions';
import { fetchEvents } from '../services/eventsApi';
import { Event, Pagination } from '../types';
import { useAuthStore } from '../store/authStore';

const Events: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isRTL = i18n.dir() === 'rtl';

  const filters = [
    { key: 'all', label: t('events.filter.all') },
    { key: 'workshop', label: t('events.filter.workshop') },
    { key: 'conference', label: t('events.filter.conference') },
    { key: 'networking', label: t('events.filter.networking') },
  ];

  const statusFilters = [
    { key: 'upcoming', label: t('events.status.upcoming') },
    { key: 'active', label: t('events.status.active') },
    { key: 'completed', label: t('events.status.completed') },
  ];

  const isMember = isAuthenticated && user?.role === 'user';
  // const isAdmin = isAuthenticated && user?.role === 'admin';

  // Prepare query parameters
  const queryParams = {
    category: selectedFilter === 'all' ? undefined : selectedFilter,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 10,
    status: selectedStatus,
  };

  // Fetch events using React Query with proper error boundaries
  const {
    data: eventsData,
    isLoading,
    // isError,
    // error,
  } = useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => fetchEvents(queryParams),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const events: Event[] =
    eventsData && 'data' in eventsData && eventsData.data.items
      ? eventsData.data.items
      : [];
  const pagination: Pagination | undefined =
    eventsData && 'data' in eventsData && eventsData.data.pagination
      ? eventsData.data.pagination
      : undefined;

  // Handle filter changes
  const handleFilterChange = (filterKey: string) => {
    setSelectedFilter(filterKey);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle status changes
  const handleStatusChange = (statusKey: string) => {
    setSelectedStatus(statusKey);
    setCurrentPage(1); // Reset to first page when status changes
  };

  // Handle search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // تم حذف شرط isMember لتكون الصفحة متاحة للجميع
  // if (!isMember) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[60vh] text-xl text-gray-600">
  //       {t('events.membersOnly')}
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header Section */}
      <SectionTitle
        title={t('events.title')}
        description={t('events.subtitle')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="text-center mt-10"
      />
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto my-8">
        <Input
          type="text"
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          icon={<Search />}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="flex-1"
        />
        <QuickActions dir={isRTL ? 'rtl' : 'ltr'}>
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? 'primary' : 'outline'}
              onClick={() => handleFilterChange(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </QuickActions>
      </div>
      {/* Status Filter */}
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto my-8">
        <QuickActions dir={isRTL ? 'rtl' : 'ltr'}>
          {statusFilters.map((status) => (
            <Button
              key={status.key}
              variant={selectedStatus === status.key ? 'primary' : 'outline'}
              onClick={() => handleStatusChange(status.key)}
            >
              {status.label}
            </Button>
          ))}
        </QuickActions>
      </div>
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto my-8">
        {[
          {
            number: events.length.toString(),
            label: t('events.stats.total'),
            icon: Calendar,
          },
          {
            number: events
              .filter((e: Event) => e.status === 'upcoming')
              .length.toString(),
            label: t('events.stats.upcoming'),
            icon: Clock,
          },
          {
            number: events
              .filter((e: Event) => e.status === 'active')
              .length.toString(),
            label: t('events.stats.active'),
            icon: Users,
          },
          {
            number: events
              .filter((e: Event) => e.status === 'completed')
              .length.toString(),
            label: t('events.stats.completed'),
            icon: Calendar,
          },
        ].map((stat, idx) => (
          <Card key={idx} variant="elevated" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl text-primary">
                {React.createElement(stat.icon)}
              </span>
              <span className="text-2xl font-bold">{stat.number}</span>
            </div>
            <div className="text-lg font-semibold mb-1">{stat.label}</div>
          </Card>
        ))}
      </div>
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto my-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} height={220} />
          ))
        ) : events.length === 0 ? (
          <Alert variant="info">{t('events.empty')}</Alert>
        ) : (
          events.map((event: Event) => (
            <Card key={event.id} variant="elevated" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-primary" />
                <span className="font-bold">{event.title}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary text-sm mb-2">
                <MapPin className="text-accent" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary text-sm mb-2">
                <Clock className="text-primary" />
                <span>{format(new Date(event.start_date), 'yyyy-MM-dd')}</span>
              </div>
              <Button as={Link} to={`/events/${event.id}`} variant="primary">
                {t('events.cta')}
              </Button>
            </Card>
          ))
        )}
      </div>
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center my-8 gap-2">
          {Array.from({ length: pagination.totalPages }).map((_, idx) => (
            <Button
              key={idx}
              variant={
                pagination.currentPage === idx + 1 ? 'primary' : 'outline'
              }
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
