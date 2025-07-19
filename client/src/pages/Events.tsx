import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LazyImage from '../components/common/LazyImage';
import Skeleton from '../components/common/Skeleton';
import { fetchEvents } from '../services/eventsApi';
import { Event } from '../types';
import { useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const Events: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const isRTL = i18n.dir() === 'rtl';

  const filters = [
    { key: 'all', label: t('events.filter.all') },
    { key: 'workshop', label: t('events.filter.workshop') },
    { key: 'conference', label: t('events.filter.conference') },
    { key: 'networking', label: t('events.filter.networking') },
  ];

  // Prepare query parameters
  const queryParams = {
    category: selectedFilter === 'all' ? undefined : selectedFilter,
    search: debouncedSearch || undefined,
    page: currentPage,
    limit: 10,
    status: 'upcoming',
  };

  // Fetch events using React Query
  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => fetchEvents(queryParams),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const events = eventsData?.data?.items || [];
  const pagination = eventsData?.data?.pagination;

  // Handle filter changes
  const handleFilterChange = (filterKey: string) => {
    setSelectedFilter(filterKey);
    setCurrentPage(1);
  };

  // Handle search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-neutral-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={t('events.title')}
        description={t('events.subtitle')}
        type="website"
      />

      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50 text-center mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary-700">
            {t('events.title')}
          </h1>
          <p className="text-lg md:text-2xl text-neutral-700 mb-8">
            {t('events.subtitle')}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full max-w-md">
            <Input
              ref={inputRef}
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              fullWidth
            />
            {isLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto">
                <LoadingSpinner size="sm" />
              </span>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? 'primary' : 'outline'}
                size="md"
                onClick={() => handleFilterChange(filter.key)}
                className={
                  selectedFilter === filter.key ? 'ring-2 ring-primary-400' : ''
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 mb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
              >
                <Skeleton height={180} className="w-full mb-4" />
                <Skeleton height={24} width="60%" />
                <Skeleton height={16} width="40%" />
                <Skeleton height={16} width="80%" />
                <div className="flex gap-2 mt-2">
                  <Skeleton height={32} width={80} />
                  <Skeleton height={32} width={80} />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <Alert type="error">{t('events.error')}</Alert>
        ) : events.length === 0 ? (
          <Alert type="info">{t('events.noEvents')}</Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: Event) => (
              <Card key={event.id} variant="default" padding="md">
                {event.image_url && (
                  <LazyImage
                    src={event.image_url || '/images/istanbul-mosque.jpg'}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-t-md mb-3"
                  />
                )}
                <div className="font-bold text-lg mb-2">{event.title}</div>
                <div className="text-sm text-neutral-600 mb-2">
                  {event.location} | {event.start_date}
                </div>
                <div className="text-sm text-neutral-500 mb-4 line-clamp-3">
                  {event.description}
                </div>
                <a href={`/events/${event.id}`}>
                  <Button size="sm">{t('events.viewDetails')}</Button>
                </a>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <section className="container mx-auto px-4 my-8 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, idx) => (
              <Button
                key={idx + 1}
                variant={pagination.page === idx + 1 ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Events;
