import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Clock,
  Filter,
  Eye,
  ChevronDown,
} from 'lucide-react';

import { fetchEvents } from '../services/eventsApi';
import { Event } from '../types';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/InputSimple';
import { Alert } from '../components/common/DesignSystem';
import UnifiedLoader from '../components/common/UnifiedLoader';
import { useDebounce } from '../hooks/useDebounce';

// تحسين الأداء - مكونات منفصلة
const EventsHero = memo(({ events }: { events: Event[] }) => {
  const { t } = useTranslation();

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-brand-hero text-white">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-20"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-primary-900/60 to-dark-800/80"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-6"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {t('events.title', 'الفعاليات')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            {t(
              'events.description',
              'اكتشف الفعاليات القادمة وسجل فيها للمشاركة في أنشطة شبابنا المميزة'
            )}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center items-center gap-6"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {events?.length || 0}
              </div>
              <div className="text-primary-200 text-sm">
                {t('events.stats.available', 'فعالية متاحة')}
              </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {events?.filter((e) => e.status === 'upcoming').length || 0}
              </div>
              <div className="text-primary-200 text-sm">
                {t('events.stats.upcoming', 'قادمة')}
              </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {events?.filter((e) => e.status === 'active').length || 0}
              </div>
              <div className="text-primary-200 text-sm">
                {t('events.stats.active', 'نشطة')}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

const SearchAndFilters = memo(
  ({
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    selectedFilter,
    setSelectedFilter,
  }: {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    selectedFilter: string;
    setSelectedFilter: (filter: string) => void;
  }) => {
    const { t } = useTranslation();

    const filters = [
      {
        key: 'all',
        label: t('events.filter.all', 'كل الفعاليات'),
        icon: '🎯',
        color: 'primary',
      },
      {
        key: 'workshop',
        label: t('events.filter.workshop', 'ورش العمل'),
        icon: '🔧',
        color: 'secondary',
      },
      {
        key: 'conference',
        label: t('events.filter.conference', 'مؤتمرات'),
        icon: '🎤',
        color: 'accent',
      },
      {
        key: 'networking',
        label: t('events.filter.networking', 'تواصل وشبكات'),
        icon: '🤝',
        color: 'primary',
      },
      {
        key: 'seminar',
        label: t('events.filter.seminar', 'ندوات'),
        icon: '📚',
        color: 'secondary',
      },
      {
        key: 'training',
        label: t('events.filter.training', 'تدريب'),
        icon: '💡',
        color: 'accent',
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12 space-y-6"
      >
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={t(
                'events.searchPlaceholder',
                'البحث في الفعاليات...'
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 text-lg border-primary-200 focus:border-primary-500"
              size="lg"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border-primary-200 text-primary-600 hover:bg-primary-50"
          >
            <Filter className="w-4 h-4" />
            الفلاتر
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>

        {/* Filter Tabs */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap justify-center gap-3 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary-200">
                {filters.map((filter) => (
                  <motion.div
                    key={filter.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={
                        selectedFilter === filter.key ? 'primary' : 'outline'
                      }
                      onClick={() => setSelectedFilter(filter.key)}
                      className={`flex items-center gap-2 ${
                        selectedFilter === filter.key
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'border-primary-200 text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      <span className="text-lg">{filter.icon}</span>
                      {filter.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

const EventCard = memo(
  ({
    event,
    onRegisterClick,
  }: {
    event: Event;
    onRegisterClick: (event: Event) => void;
  }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const formatDate = useCallback((dateString: string) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          console.error('❌ Invalid date string:', dateString);
          return 'تاريخ غير صحيح';
        }
        return date.toLocaleDateString('ar-SA', {
          day: 'numeric',
          month: 'short',
        });
      } catch (error) {
        console.error('❌ Error formatting date:', error);
        return 'تاريخ غير صحيح';
      }
    }, []);

    const formatTime = useCallback((dateString: string) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          console.error('❌ Invalid time string:', dateString);
          return 'وقت غير صحيح';
        }
        return date.toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      } catch (error) {
        console.error('❌ Error formatting time:', error);
        return 'وقت غير صحيح';
      }
    }, []);

    const getStatusColor = useCallback((status: string) => {
      switch (status) {
        case 'upcoming':
          return 'bg-primary-100 text-primary-800 border-primary-200';
        case 'active':
          return 'bg-secondary-100 text-secondary-800 border-secondary-200';
        case 'completed':
          return 'bg-dark-100 text-dark-800 border-dark-200';
        case 'cancelled':
          return 'bg-error-100 text-error-800 border-error-200';
        default:
          return 'bg-dark-100 text-dark-800 border-dark-200';
      }
    }, []);

    const getStatusText = useCallback((status: string) => {
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
    }, []);

    const getCategoryIcon = useCallback((category: string) => {
      const categoryMap: { [key: string]: string } = {
        workshop: '🔧',
        conference: '🎤',
        networking: '🤝',
        seminar: '📚',
        training: '💡',
      };
      return categoryMap[category] || '🎯';
    }, []);

    const getCategoryColor = useCallback((category: string) => {
      const colorMap: { [key: string]: string } = {
        workshop: 'bg-secondary-100 text-secondary-800',
        conference: 'bg-primary-100 text-primary-800',
        networking: 'bg-accent-100 text-accent-800',
        seminar: 'bg-secondary-100 text-secondary-800',
        training: 'bg-primary-100 text-primary-800',
      };
      return colorMap[category] || 'bg-dark-100 text-dark-800';
    }, []);

    const calculateDaysUntil = useCallback((dateString: string) => {
      const eventDate = new Date(dateString);
      const today = new Date();
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }, []);

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4 }}
        className="group"
      >
        <Card className="h-full bg-white border border-primary-200 hover:shadow-brand-md transition-all duration-300 overflow-hidden">
          {/* Event Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image_url || '/images/events-default.jpg'}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/images/events-default.jpg';
              }}
            />

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  event.status
                )}`}
              >
                {t(
                  `events.status.${event.status}`,
                  getStatusText(event.status)
                )}
              </span>
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  event.category
                )}`}
              >
                {getCategoryIcon(event.category)}{' '}
                {t(`events.categories.${event.category}`, event.category)}
              </span>
            </div>
          </div>

          {/* Event Content */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-dark-500 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
              {event.title}
            </h3>

            <p className="text-dark-400 text-sm mb-4 line-clamp-3">
              {event.description}
            </p>

            {/* Event Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span className="font-medium">
                  {formatDate(event.start_date)} في{' '}
                  {formatTime(event.start_date)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-dark-400">
                <MapPin className="w-4 h-4 text-accent-500" />
                <span>{event.location}</span>
              </div>

              {event.max_attendees && (
                <div className="flex items-center gap-2 text-sm text-dark-400">
                  <Users className="w-4 h-4 text-primary-500" />
                  <span>
                    {event.attendees || 0} / {event.max_attendees}{' '}
                    {t('events.attendees', 'مشارك')}
                  </span>
                </div>
              )}
            </div>

            {/* Days Until */}
            {event.status === 'upcoming' && (
              <div className="mb-4 p-2 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-600 font-medium">
                  {calculateDaysUntil(event.start_date) > 0
                    ? t('events.daysRemaining', {
                        count: calculateDaysUntil(event.start_date),
                      })
                    : t('events.today', 'اليوم!')}
                </p>
              </div>
            )}

            {/* Action Button - unified */}
            <div className="flex">
              <Button
                variant="primary"
                onClick={() => navigate(`/events/${event.id}`)}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                disabled={
                  event.status === 'completed' || event.status === 'cancelled'
                }
              >
                {event.status === 'completed'
                  ? t('events.actions.completed', 'مكتملة')
                  : event.status === 'cancelled'
                  ? t('events.actions.cancelled', 'ملغية')
                  : t('events.actions.register', 'سجل الآن')}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
);

const EventsGrid = memo(
  ({
    events,
    onRegisterClick,
  }: {
    events: Event[];
    onRegisterClick: (event: Event) => void;
  }) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegisterClick={onRegisterClick}
          />
        ))}
      </motion.div>
    );
  }
);

const Events: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);

  // Prepare query parameters
  const queryParams = {
    category: selectedFilter === 'all' ? undefined : selectedFilter,
    search: debouncedSearch || undefined,
    page: currentPage,
    limit: 9,
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
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  const events = eventsData?.data?.events || [];
  const pagination = eventsData?.data?.pagination;

  const handleRegisterClick = useCallback(
    (event: Event) => {
      navigate(`/events/${event.id}/register`);
    },
    [navigate]
  );

  return (
    <div className="page-container bg-blue-50">
      <SEO
        title={t('events.pageTitle', 'الفعاليات - منصة شبابنا')}
        description={t(
          'events.pageDescription',
          'اكتشف الفعاليات القادمة وسجل فيها'
        )}
        type="website"
        keywords={['فعاليات', 'منصة شبابنا', 'تسجيل فعاليات', 'أنشطة شبابية']}
      />

      <EventsHero events={events} />

      <div className="container mx-auto px-4 py-12">
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <UnifiedLoader
              message={t('events.loading', 'جاري تحميل الفعاليات...')}
            />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <Alert
              type="error"
              title={t('events.error.title', 'خطأ في التحميل')}
              description={
                error?.message ||
                t('events.error.description', 'حدث خطأ في تحميل الفعاليات')
              }
              className="max-w-md mx-auto"
            />
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !isError && events.length > 0 && (
          <EventsGrid events={events} onRegisterClick={handleRegisterClick} />
        )}

        {/* Empty State */}
        {!isLoading && !isError && events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              لا توجد فعاليات متاحة
            </h3>
            <p className="text-gray-600">
              تحقق من الفلاتر أو عد لاحقاً للاطلاع على الفعاليات الجديدة
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-primary-200 text-primary-600 hover:bg-primary-50 bg-white'
                  }
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {/* The EventRegistrationModal component is now rendered separately */}
    </div>
  );
};

export default Events;
