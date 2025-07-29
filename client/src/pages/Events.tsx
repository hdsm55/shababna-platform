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
  X,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  Eye,
  Heart,
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
    {
      key: 'all',
      label: t('events.filter.all', 'جميع الفعاليات'),
      icon: <Eye className="w-4 h-4" />,
    },
    {
      key: 'workshop',
      label: t('events.filter.workshop', 'ورش عمل'),
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      key: 'conference',
      label: t('events.filter.conference', 'مؤتمرات'),
      icon: <Award className="w-4 h-4" />,
    },
    {
      key: 'networking',
      label: t('events.filter.networking', 'شبكة تواصل'),
      icon: <Users className="w-4 h-4" />,
    },
    {
      key: 'seminar',
      label: t('events.filter.seminar', 'ندوات'),
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      key: 'training',
      label: t('events.filter.training', 'تدريب'),
      icon: <Sparkles className="w-4 h-4" />,
    },
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
    refetch,
  } = useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => fetchEvents(queryParams),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
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
        return 'bg-gradient-to-r from-primary-500 to-primary-600 text-white';
      case 'active':
        return 'bg-gradient-to-r from-success-500 to-success-600 text-white';
      case 'completed':
        return 'bg-gradient-to-r from-neutral-500 to-neutral-600 text-white';
      case 'cancelled':
        return 'bg-gradient-to-r from-error-500 to-error-600 text-white';
      default:
        return 'bg-gradient-to-r from-neutral-500 to-neutral-600 text-white';
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

  const getProgressPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={t('events.seo.title', 'الفعاليات - منصة شبابنا العالمية')}
        description={t(
          'events.seo.description',
          'اكتشف فعالياتنا المتنوعة في مجالات التعليم والروحانيات والتطوير المهني.'
        )}
        type="website"
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-40 w-24 h-24 bg-accent-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white to-accent-50 rounded-2xl mb-6 shadow-2xl"
          >
            <Calendar className="w-12 h-12 text-primary-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent"
          >
            {t('events.hero.title', 'فعالياتنا المتنوعة')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            {t(
              'events.hero.subtitle',
              'اكتشف فعالياتنا المتنوعة في مجالات التعليم والروحانيات والتطوير المهني. انضم إلينا في صناعة التغيير الإيجابي.'
            )}
          </motion.p>
        </div>
      </section>

      {/* Search and Filters Section - Enhanced */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-white to-primary-50 p-8 rounded-3xl shadow-2xl border border-primary-100"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Search Bar - Enhanced */}
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary-400" />
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
                className="pl-12 pr-4 py-4 bg-white border-primary-200 focus:border-primary-500 focus:ring-primary-500 shadow-lg rounded-xl"
                fullWidth
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters - Enhanced */}
            <div className="flex flex-wrap gap-3">
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
                    size="md"
                    onClick={() => handleFilterChange(filter.key)}
                    className={`transition-all duration-200 ${
                      selectedFilter === filter.key
                        ? 'shadow-lg shadow-primary-200 ring-2 ring-primary-300'
                        : 'hover:shadow-md hover:shadow-primary-100'
                    }`}
                    icon={filter.icon}
                  >
                    {filter.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-6 pt-6 border-t border-primary-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-primary-600 font-medium">
                {t('events.results', 'تم العثور على {count} فعالية', {
                  count: events.length,
                })}
              </p>
              {isError && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="text-primary-600"
                >
                  إعادة المحاولة
                </Button>
              )}
            </div>
          </div>
        </motion.div>
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
            {events.map((event: Event, index: number) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border-0 bg-gradient-to-br from-white to-neutral-50">
                  <div className="p-6">
                    {/* Event Image */}
                    <div className="mb-6">
                      <div className="relative overflow-hidden rounded-2xl">
                        <img
                          src={
                            event.image_url || '/images/event-placeholder.svg'
                          }
                          alt={event.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            console.log(
                              'Image failed to load:',
                              event.image_url
                            );
                            e.currentTarget.src =
                              '/images/event-placeholder.svg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-white text-sm font-medium ml-1">
                              مميز
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${getStatusColor(
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
                    <h3 className="text-xl font-bold text-primary-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>التسجيل</span>
                        <span>
                          {getProgressPercentage(
                            event.attendees || 0,
                            event.max_attendees || 1
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getProgressPercentage(
                              event.attendees || 0,
                              event.max_attendees || 1
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.start_date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.category}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link to={`/events/${event.id}`}>
                      <Button className="w-full group-hover:shadow-lg transform group-hover:scale-105">
                        <span className="flex items-center justify-center">
                          عرض التفاصيل
                          <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        </span>
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
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-accent-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white to-accent-50 rounded-2xl mb-6 shadow-2xl"
            >
              <Heart className="w-12 h-12 text-primary-600" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent">
              {t('events.cta.title', 'انضم إلينا في الفعاليات')}
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t(
                'events.cta.description',
                'سجل في فعالياتنا وكن جزءاً من مجتمعنا النشط. كل فعالية فرصة للتعلم والتطوير.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/join-us">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
                >
                  {t('events.cta.join', 'انضم إلينا')}
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-900 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
                >
                  {t('events.cta.contact', 'تواصل معنا')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;
