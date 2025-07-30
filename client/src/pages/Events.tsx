import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  Clock,
  Eye,
  Grid3X3,
  List,
  Info,
} from 'lucide-react';

import { fetchEvents } from '../services/eventsApi';
import { Event } from '../types';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { Modal } from '../components/ui/Modal/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';

const Events: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isRTL = i18n.dir() === 'rtl';

  const filters = [
    { key: 'all', label: t('events.filter.all', 'كل الفعاليات'), icon: '🎯' },
    {
      key: 'workshop',
      label: t('events.filter.workshop', 'ورش العمل'),
      icon: '🔧',
    },
    {
      key: 'conference',
      label: t('events.filter.conference', 'مؤتمرات'),
      icon: '🎤',
    },
    {
      key: 'networking',
      label: t('events.filter.networking', 'تواصل وشبكات'),
      icon: '🤝',
    },
    { key: 'seminar', label: t('events.filter.seminar', 'ندوات'), icon: '📚' },
    {
      key: 'training',
      label: t('events.filter.training', 'تدريب'),
      icon: '💡',
    },
  ];

  // Prepare query parameters
  const queryParams = {
    category: selectedFilter === 'all' ? undefined : selectedFilter,
    search: debouncedSearch || undefined,
    page: currentPage,
    limit: 8, // تقليل عدد الفعاليات المعروضة
  };

  // Fetch events using React Query with real-time updates
  const {
    data: eventsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => fetchEvents(queryParams),
    retry: 1,
    staleTime: 0,
    refetchInterval: 30000,
  });

  const events = eventsData?.data?.events || [];
  const pagination = eventsData?.data?.pagination;

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('تسجيل في الفعالية:', selectedEvent?.title);
      console.log('بيانات التسجيل:', registrationForm);

      setShowRegistrationModal(false);
      setRegistrationForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
      setSelectedEvent(null);

      await refetch();
      queryClient.invalidateQueries({ queryKey: ['events'] });

      alert('تم التسجيل بنجاح!');
    } catch (error) {
      console.error('خطأ في التسجيل:', error);
      alert('حدث خطأ في التسجيل. حاول مرة أخرى.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setRegistrationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getCategoryIcon = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      workshop: '🔧',
      conference: '🎤',
      networking: '🤝',
      seminar: '📚',
      training: '💡',
    };
    return categoryMap[category] || '🎯';
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      workshop: 'bg-orange-100 text-orange-800',
      conference: 'bg-blue-100 text-blue-800',
      networking: 'bg-green-100 text-green-800',
      seminar: 'bg-purple-100 text-purple-800',
      training: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  const handleUnavailable = (msg: string) => {
    alert(msg);
  };

  const calculateDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <SEO
        title={t('events.pageTitle', 'الفعاليات - منصة شبابنا')}
        description={t(
          'events.pageDescription',
          'اكتشف الفعاليات القادمة وسجل فيها'
        )}
        type="website"
      />

      {/* Enhanced Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl font-bold mb-4">
              {t('events.title', 'الفعاليات')}
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              {t(
                'events.description',
                'اكتشف الفعاليات القادمة وسجل فيها للمشاركة في أنشطة شبابنا المميزة'
              )}
            </p>
            <div className="flex justify-center items-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{events.length}</div>
                <div className="text-slate-300 text-sm">فعالية متاحة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {events.filter((e) => e.status === 'upcoming').length}
                </div>
                <div className="text-slate-300 text-sm">قادمة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {events.filter((e) => e.status === 'active').length}
                </div>
                <div className="text-slate-300 text-sm">نشطة</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 space-y-6"
        >
          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={t(
                  'events.searchPlaceholder',
                  'البحث في الفعاليات...'
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2"
              >
                <Grid3X3 className="w-4 h-4" />
                شبكي
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                قائمة
              </Button>
            </div>
          </div>

          {/* Enhanced Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3">
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
                  size="sm"
                  onClick={() => setSelectedFilter(filter.key)}
                  className="text-sm flex items-center gap-2"
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-16"
          >
            <LoadingSpinner size="lg" />
          </motion.div>
        )}

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">
                {error?.message ||
                  t('events.error', 'حدث خطأ في تحميل الفعاليات')}
              </p>
              <Button variant="primary" onClick={() => refetch()}>
                {t('common.retry', 'إعادة المحاولة')}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Events Display */}
        {!isLoading && !isError && (
          <AnimatePresence mode="wait">
            {events.length > 0 ? (
              <motion.div
                key={viewMode}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {events.map((event: Event, _index: number) => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {viewMode === 'grid' ? (
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white overflow-hidden group">
                        <div className="relative">
                          {/* Event Image */}
                          <div className="relative h-48 bg-gradient-to-br from-slate-600 via-blue-600 to-slate-700 overflow-hidden">
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="text-4xl mb-2">
                                  {getCategoryIcon(event.category)}
                                </div>
                                <p className="text-lg font-medium">
                                  {event.category || 'فعالية'}
                                </p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  event.status
                                )}`}
                              >
                                {getStatusText(event.status)}
                              </span>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-3 left-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                  event.category
                                )}`}
                              >
                                {event.category}
                              </span>
                            </div>

                            {/* Days Until */}
                            {event.status === 'upcoming' && (
                              <div className="absolute bottom-3 left-3">
                                <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {calculateDaysUntil(event.start_date)} يوم
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Event Info */}
                          <div className="p-6 space-y-4">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                {event.title}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-3">
                                {event.description}
                              </p>
                            </div>

                            {/* Event Details */}
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>{formatDate(event.start_date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 text-green-500" />
                                <span>{formatTime(event.start_date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span className="line-clamp-1">
                                  {event.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-4 h-4 text-purple-500" />
                                <span>
                                  {event.attendees || 0}
                                  {event.max_attendees &&
                                    ` / ${event.max_attendees}`}{' '}
                                  مشارك
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar for Registration */}
                            {event.max_attendees && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>التسجيل</span>
                                  <span>
                                    {Math.round(
                                      ((event.attendees || 0) /
                                        event.max_attendees) *
                                        100
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${Math.min(
                                        ((event.attendees || 0) /
                                          event.max_attendees) *
                                          100,
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-4 space-y-2">
                              <Button
                                variant="primary"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                onClick={() => {
                                  if (event.status === 'completed') {
                                    handleUnavailable(
                                      'لا يمكن التسجيل في فعالية مكتملة'
                                    );
                                  } else if (
                                    event.attendees >=
                                      (event.max_attendees || 0) &&
                                    (event.max_attendees || 0) > 0
                                  ) {
                                    handleUnavailable('الفعالية ممتلئة');
                                  } else {
                                    navigate(`/events/${event.id}`);
                                  }
                                }}
                              >
                                {event.status === 'completed'
                                  ? t('events.completed', 'مكتملة')
                                  : event.attendees >=
                                      (event.max_attendees || 0) &&
                                    (event.max_attendees || 0) > 0
                                  ? t('events.full', 'ممتلئة')
                                  : t('events.register', 'سجل الآن')}
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full flex items-center justify-center gap-1 group-hover:border-blue-500 group-hover:text-blue-600 transition-all duration-300"
                                onClick={() => navigate(`/events/${event.id}`)}
                              >
                                <Info className="w-4 h-4" />
                                التفاصيل
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      // List View
                      <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Event Image */}
                            <div className="relative w-24 h-24 bg-gradient-to-br from-slate-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <div className="text-center text-white">
                                <div className="text-2xl">
                                  {getCategoryIcon(event.category)}
                                </div>
                              </div>
                              <div className="absolute top-1 right-1">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    event.status
                                  )}`}
                                >
                                  {getStatusText(event.status)}
                                </span>
                              </div>
                            </div>

                            {/* Event Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                                  {event.title}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                    event.category
                                  )}`}
                                >
                                  {event.category}
                                </span>
                              </div>

                              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {event.description}
                              </p>

                              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4 text-blue-500" />
                                  <span>{formatDate(event.start_date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-green-500" />
                                  <span>{formatTime(event.start_date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-red-500" />
                                  <span className="line-clamp-1">
                                    {event.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-purple-500" />
                                  <span>
                                    {event.attendees || 0}
                                    {event.max_attendees &&
                                      ` / ${event.max_attendees}`}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => {
                                    if (event.status === 'completed') {
                                      handleUnavailable(
                                        'لا يمكن التسجيل في فعالية مكتملة'
                                      );
                                    } else if (
                                      event.attendees >=
                                        (event.max_attendees || 0) &&
                                      (event.max_attendees || 0) > 0
                                    ) {
                                      handleUnavailable('الفعالية ممتلئة');
                                    } else {
                                      navigate(`/events/${event.id}`);
                                    }
                                  }}
                                >
                                  {event.status === 'completed'
                                    ? t('events.completed', 'مكتملة')
                                    : event.attendees >=
                                        (event.max_attendees || 0) &&
                                      (event.max_attendees || 0) > 0
                                    ? t('events.full', 'ممتلئة')
                                    : t('events.register', 'سجل الآن')}
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/events/${event.id}`)
                                  }
                                  className="flex items-center gap-1 group-hover:border-blue-500 group-hover:text-blue-600 transition-all duration-300"
                                >
                                  <Info className="w-4 h-4" />
                                  التفاصيل
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    لا توجد فعاليات متاحة
                  </h3>
                  <p className="text-gray-500 mb-4">
                    لا توجد فعاليات متاحة حالياً. تحقق لاحقاً من الفعاليات
                    الجديدة.
                  </p>
                  <Button variant="primary" onClick={() => refetch()}>
                    تحديث الصفحة
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Enhanced Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-12"
          >
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                السابق
              </Button>

              <div className="flex gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="flex items-center gap-1"
              >
                التالي
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Registration Modal */}
      <Modal
        open={showRegistrationModal}
        onClose={() => {
          setShowRegistrationModal(false);
          setSelectedEvent(null);
          setRegistrationForm({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
          });
        }}
        title={t('events.registration.title', 'تسجيل في الفعالية')}
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Event Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                {selectedEvent.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {selectedEvent.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>{formatDate(selectedEvent.start_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('events.registration.firstName', 'الاسم الأول')}
                  value={registrationForm.firstName}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  required
                />
                <Input
                  label={t('events.registration.lastName', 'اسم العائلة')}
                  value={registrationForm.lastName}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  required
                />
              </div>

              <Input
                label={t('events.registration.email', 'البريد الإلكتروني')}
                type="email"
                value={registrationForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />

              <Input
                label={t('events.registration.phone', 'رقم الهاتف')}
                type="tel"
                value={registrationForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />

              <div className="flex gap-3">
                <Button type="submit" variant="primary" className="flex-1">
                  {t('events.registration.submit', 'تأكيد التسجيل')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRegistrationModal(false);
                    setSelectedEvent(null);
                    setRegistrationForm({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                    });
                  }}
                >
                  {t('common.cancel', 'إلغاء')}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Events;
