import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEvents } from '../services/eventsApi';
import { Event } from '../types';
import { useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const isRTL = i18n.dir() === 'rtl';

  const filters = [
    { key: 'all', label: t('events.filter.all', 'جميع الفعاليات') },
    { key: 'محاضرة', label: t('events.filter.lecture', 'محاضرات') },
    { key: 'دورة', label: t('events.filter.course', 'دورات') },
    { key: 'معسكر', label: t('events.filter.camp', 'معسكرات') },
    { key: 'ورشة', label: t('events.filter.workshop', 'ورش عمل') },
    { key: 'مؤتمر', label: t('events.filter.conference', 'مؤتمرات') },
  ];

  // Prepare query parameters
  const queryParams = {
    category: selectedFilter === 'all' ? undefined : selectedFilter,
    search: debouncedSearch || undefined,
    page: currentPage,
    limit: 12,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'قادمة';
      case 'active':
        return 'نشطة';
      case 'completed':
        return 'مكتملة';
      case 'cancelled':
        return 'ملغية';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={t('events.seo.title', 'الفعاليات - منصة شبابنا العالمية')}
        description={t(
          'events.seo.description',
          'اكتشف فعالياتنا المتنوعة في مجالات التعليم والروحانيات والتطوير المهني.'
        )}
        type="website"
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-primary-900 mb-6"
          >
            {t('events.hero.title', 'فعالياتنا المتنوعة')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-primary-700 max-w-3xl mx-auto mb-8"
          >
            {t(
              'events.hero.subtitle',
              'اكتشف فعالياتنا المتنوعة في مجالات التعليم والروحانيات والتطوير المهني. انضم إلينا في صناعة التغيير الإيجابي.'
            )}
          </motion.p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-2xl shadow-sm">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              ref={inputRef}
              type="text"
              placeholder={t(
                'events.search.placeholder',
                'ابحث في الفعاليات...'
              )}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              fullWidth
            />
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
      <section className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : isError ? (
          <Alert type="error">
            {t(
              'events.error',
              'حدث خطأ أثناء جلب الفعاليات. يرجى المحاولة لاحقًا.'
            )}
          </Alert>
        ) : events.length === 0 ? (
          <Alert type="info">
            {t('events.noEvents', 'لا توجد فعاليات متاحة حالياً.')}
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: Event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    {/* Event Image */}
                    <div className="mb-4">
                      <img
                        src={event.image_url || '/images/event-placeholder.jpg'}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-lg"
                        loading="lazy"
                        onError={(e) =>
                          (e.currentTarget.src = '/images/fallback.jpg')
                        }
                      />
                    </div>

                    {/* Event Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {getStatusText(event.status)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {event.attendees}/{event.max_attendees || 'غير محدد'}
                      </div>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-xl font-bold text-primary-900 mb-2">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {formatDate(event.start_date)}
                          {event.end_date !== event.start_date &&
                            ` - ${formatDate(event.end_date)}`}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{event.category}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/events/${event.id}`}>
                      <Button className="w-full">
                        {t('events.viewDetails', 'عرض التفاصيل')}
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <section className="container mx-auto px-4 py-8 flex justify-center">
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

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('events.cta.title', 'انضم إلينا في الفعاليات')}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {t(
              'events.cta.description',
              'سجل في فعالياتنا وكن جزءاً من مجتمعنا النشط. كل فعالية فرصة للتعلم والتطوير.'
            )}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/join-us">
              <Button size="lg" className="bg-accent-500 hover:bg-accent-600">
                {t('events.cta.join', 'انضم إلينا')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-900"
              >
                {t('events.cta.contact', 'تواصل معنا')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
