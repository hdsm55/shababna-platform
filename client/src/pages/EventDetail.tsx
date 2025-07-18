import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Share2,
  Heart,
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEventById, registerForEvent } from '../services/eventsApi';
import { Event } from '../types';
import {
  AccessibleSection,
  AccessibleCard,
  AccessibleButton,
  SkipToContent,
} from '../components/common/AccessibleComponents';

const EventDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  console.log('Event id from URL:', id);
  // Fetch event details
  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log('Fetched event data:', event);
    console.log('isLoading:', isLoading, 'isError:', isError, 'error:', error);
  }, [event, isLoading, isError, error]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegistrationStatus('idle');
    try {
      if (!id) throw new Error('No event ID');
      // أرسل الحقول بـ snake_case فقط
      const payload: any = {
        first_name: registrationForm.firstName,
        last_name: registrationForm.lastName,
        email: registrationForm.email,
        phone: registrationForm.phone,
      };
      if (registrationForm.organization) {
        payload.organization = registrationForm.organization;
      }
      const res = await registerForEvent(id, payload);
      if (res.success) {
        setRegistrationStatus('success');
        setRegistrationForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          organization: '',
        });
      } else {
        setRegistrationStatus('error');
      }
    } catch (err) {
      setRegistrationStatus('error');
    } finally {
      setIsRegistering(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-primary-100 text-primary-800';
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'completed':
        return 'bg-neutral-100 text-neutral-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workshop':
        return 'bg-accent-100 text-accent-800';
      case 'conference':
        return 'bg-secondary-100 text-secondary-800';
      case 'networking':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto animate-pulse">
          <div className="h-56 bg-gray-200 rounded-2xl mb-8" />
          <div className="h-10 bg-gray-200 rounded w-2/3 mb-4" />
          <div className="h-6 bg-gray-100 rounded w-1/2 mb-6" />
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mb-8" />
          <div className="h-12 bg-gray-200 rounded mb-4 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    let errorMsg = t('common.error.message');
    if (error && error instanceof Error && error.message.includes('404')) {
      errorMsg = t('events.notFound', 'عذراً، لم يتم العثور على هذه الفعالية.');
    }
    return (
      <div className="min-h-screen">
        <SkipToContent />
        <div className="container py-16">
          <Alert
            type="error"
            title={t('common.error.title', 'حدث خطأ')}
            className="max-w-2xl mx-auto"
          >
            {errorMsg}
          </Alert>
          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="primary" icon={ArrowLeft} iconPosition="left">
                {t('common.backToEvents', 'العودة للفعاليات')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SkipToContent />
      {/* Hero Section */}
      <AccessibleSection variant="hero" ariaLabel="قسم رأس تفاصيل الفعالية">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Event Banner Image */}
        <img
          src={
            event.image ||
            'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg'
          }
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
          style={{ zIndex: 0 }}
        />
        <div className="relative container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="mb-8">
                <Link
                  to="/events"
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t('common.backToEvents')}
                </Link>
              </div>

              {/* Event Header */}
              <div className="flex flex-wrap items-start gap-4 mb-6">
                {/* التصنيفات والحالة */}
                {event.category && (
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(
                      event.category
                    )}`}
                  >
                    {typeof event.category === 'string'
                      ? event.category.charAt(0).toUpperCase() +
                        event.category.slice(1)
                      : ''}
                  </span>
                )}
                {event.status && (
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {typeof event.status === 'string'
                      ? event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)
                      : ''}
                  </span>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {event.title}
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {event.description}
              </p>

              {/* Event Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* التاريخ والوقت */}
                {event.start_date && (
                  <div className="flex items-center text-white/90">
                    <Calendar className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                    <div>
                      <div className="font-medium">
                        {event.start_date &&
                        !isNaN(new Date(event.start_date).getTime())
                          ? format(new Date(event.start_date), 'MMM dd, yyyy')
                          : ''}
                      </div>
                      <div className="text-sm opacity-80">
                        {event.start_date &&
                        !isNaN(new Date(event.start_date).getTime())
                          ? format(new Date(event.start_date), 'HH:mm')
                          : ''}
                        {' - '}
                        {event.end_date &&
                        !isNaN(new Date(event.end_date).getTime())
                          ? format(new Date(event.end_date), 'HH:mm')
                          : ''}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center text-white/90">
                  <MapPin className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{event.location}</div>
                    <div className="text-sm opacity-80">Event Venue</div>
                  </div>
                </div>

                {/* عدد الحضور */}
                {event.attendees !== undefined && (
                  <div className="flex items-center text-white/90">
                    <Users className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                    <div>
                      <div className="font-medium">
                        {typeof event.attendees === 'number'
                          ? event.attendees
                          : 0}
                        /
                        {typeof event.max_attendees === 'number'
                          ? event.max_attendees
                          : '∞'}
                      </div>
                      <div className="text-sm opacity-80">Attendees</div>
                    </div>
                  </div>
                )}

                {/* مدة الفعالية */}
                {event.start_date &&
                  event.end_date &&
                  !isNaN(new Date(event.start_date).getTime()) &&
                  !isNaN(new Date(event.end_date).getTime()) && (
                    <div className="flex items-center text-white/90">
                      <Clock className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                      <div>
                        <div className="font-medium">
                          {Math.round(
                            (new Date(event.end_date).getTime() -
                              new Date(event.start_date).getTime()) /
                              (1000 * 60 * 60)
                          )}
                          h
                        </div>
                        <div className="text-sm opacity-80">Duration</div>
                      </div>
                    </div>
                  )}
              </div>
            </motion.div>
          </div>
        </div>
      </AccessibleSection>

      {/* Content Section */}
      <AccessibleSection variant="neutral" ariaLabel="قسم محتوى الفعالية">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Image */}
              {/* تم حذف عرض الصورة هنا لأنها تظهر بالفعل في الـ Banner العلوي */}
              {/* <motion.div>
                <Card className="overflow-hidden">
                  <img
                    src={event.image || 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg'}
                    alt={event.title}
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                </Card>
              </motion.div> */}

              {/* Event Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    About This Event
                  </h2>
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-600 leading-relaxed mb-6">
                      {event.description}
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Event Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    Event Schedule
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-primary-600">
                        {event.start_date &&
                        !isNaN(new Date(event.start_date).getTime())
                          ? format(new Date(event.start_date), 'HH:mm')
                          : ''}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">
                          Event Check-in & Registration
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Arrive early to check in and get your materials
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-primary-600">
                        {event.start_date &&
                        !isNaN(new Date(event.start_date).getTime())
                          ? format(
                              new Date(
                                new Date(event.start_date).getTime() +
                                  30 * 60000
                              ),
                              'HH:mm'
                            )
                          : ''}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">
                          Opening Remarks
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Welcome and introduction to the event
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-primary-600">
                        {event.end_date &&
                        !isNaN(new Date(event.end_date).getTime())
                          ? format(new Date(event.end_date), 'HH:mm')
                          : ''}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">
                          Closing & Networking
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Wrap-up and networking opportunities
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card variant="elevated">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">
                    Register for Event
                  </h3>

                  {registrationStatus === 'success' && (
                    <Alert
                      type="success"
                      title="تم التسجيل بنجاح!"
                      className="mb-6"
                    >
                      تم تسجيلك في الفعالية بنجاح. سنرسل لك رسالة تأكيد عبر
                      البريد الإلكتروني قريبًا.
                    </Alert>
                  )}

                  {registrationStatus === 'error' && (
                    <Alert type="error" title="خطأ في التسجيل" className="mb-6">
                      حدث خطأ أثناء معالجة التسجيل. يرجى المحاولة مرة أخرى.
                    </Alert>
                  )}

                  <form onSubmit={handleRegistration} className="space-y-4">
                    <Input
                      label="First Name"
                      value={registrationForm.firstName}
                      onChange={(e) =>
                        setRegistrationForm({
                          ...registrationForm,
                          firstName: e.target.value,
                        })
                      }
                      required
                      icon={User}
                    />
                    <Input
                      label="Last Name"
                      value={registrationForm.lastName}
                      onChange={(e) =>
                        setRegistrationForm({
                          ...registrationForm,
                          lastName: e.target.value,
                        })
                      }
                      required
                      icon={User}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={registrationForm.email}
                      onChange={(e) =>
                        setRegistrationForm({
                          ...registrationForm,
                          email: e.target.value,
                        })
                      }
                      required
                      icon={Mail}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={registrationForm.phone}
                      onChange={(e) =>
                        setRegistrationForm({
                          ...registrationForm,
                          phone: e.target.value,
                        })
                      }
                      icon={Phone}
                    />
                    <Input
                      label="Organization"
                      value={registrationForm.organization}
                      onChange={(e) =>
                        setRegistrationForm({
                          ...registrationForm,
                          organization: e.target.value,
                        })
                      }
                      icon={Globe}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={isRegistering}
                      fullWidth
                      disabled={
                        event.status === 'cancelled' ||
                        event.status === 'completed'
                      }
                    >
                      {event.status === 'cancelled'
                        ? 'Event Cancelled'
                        : event.status === 'completed'
                        ? 'Event Completed'
                        : isRegistering
                        ? 'Registering...'
                        : 'Register Now'}
                    </Button>
                  </form>
                </Card>
              </motion.div>

              {/* Event Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">
                    Event Information
                  </h3>
                  <div className="space-y-4">
                    {/* معلومات الفعالية */}
                    {event.start_date && (
                      <div className="flex items-center text-neutral-600">
                        <Calendar className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                        <span className="text-sm">
                          {event.start_date &&
                          !isNaN(new Date(event.start_date).getTime())
                            ? format(
                                new Date(event.start_date),
                                'EEEE, MMMM dd, yyyy'
                              )
                            : ''}
                        </span>
                      </div>
                    )}
                    {event.start_date && event.end_date && (
                      <div className="flex items-center text-neutral-600">
                        <Clock className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                        <span className="text-sm">
                          {event.start_date &&
                          !isNaN(new Date(event.start_date).getTime())
                            ? format(new Date(event.start_date), 'HH:mm')
                            : ''}
                          {' - '}
                          {event.end_date &&
                          !isNaN(new Date(event.end_date).getTime())
                            ? format(new Date(event.end_date), 'HH:mm')
                            : ''}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-neutral-600">
                      <MapPin className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    {event.attendees !== undefined && (
                      <div className="flex items-center text-neutral-600">
                        <Users className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                        <span className="text-sm">
                          {typeof event.attendees === 'number'
                            ? event.attendees
                            : 0}
                          {event.max_attendees
                            ? ` / ${event.max_attendees} max`
                            : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Share Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">
                    Share Event
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Share2}
                      fullWidth
                      onClick={() => {
                        navigator.share?.({
                          title: event.title,
                          text: event.description,
                          url: window.location.href,
                        });
                      }}
                    >
                      Share Event
                    </Button>
                    <Button variant="ghost" size="sm" icon={Heart} fullWidth>
                      Add to Favorites
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </AccessibleSection>

      {/* Toast for registration status */}
      {registrationStatus === 'success' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {t('events.registrationSuccess', 'تم التسجيل بنجاح!')}
        </div>
      )}
      {registrationStatus === 'error' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {t(
            'events.registrationError',
            'حدث خطأ أثناء التسجيل. حاول مرة أخرى.'
          )}
        </div>
      )}

      {/* Suggested Events Section */}
      <AccessibleSection variant="content" ariaLabel="قسم الفعاليات المقترحة">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-primary-700 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            {t('events.suggested', 'فعاليات مقترحة')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* فعاليات ثابتة كمثال */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="h-32 bg-gray-200 rounded-xl mb-4" />
                <div className="h-6 bg-gray-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </Card>
            ))}
          </div>
        </div>
      </AccessibleSection>
    </div>
  );
};

export default EventDetail;
