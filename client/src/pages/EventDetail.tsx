import React, { useState, memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/InputSimple';
import { Alert } from '../components/common/AlertSimple';
import UnifiedLoader from '../components/common/UnifiedLoader';
import { fetchEventById } from '../services/eventsApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Award,
  Tag,
  Eye,
  Heart,
  Star,
} from 'lucide-react';
import ShareButtons from '../components/common/ShareButtons';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}

// تحسين الأداء - مكونات منفصلة
const EventHeader = memo(({ event }: { event: any }) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active':
        return 'bg-success-100 text-success-800 border-success-200';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="text-center mb-8"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="inline-block"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-dark-500 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {event?.title}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-4 mb-6"
      >
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            event?.status
          )}`}
        >
          {getStatusText(event?.status)}
        </span>
        <div className="flex items-center gap-2 text-dark-400">
          <Eye className="w-4 h-4" />
          <span className="text-sm">مشاهدات: {event?.views || 0}</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-lg text-dark-400 max-w-3xl mx-auto leading-relaxed"
      >
        {event?.description}
      </motion.p>
    </motion.div>
  );
});

const EventInfo = memo(({ event }: { event: any }) => {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const infoItems = [
    {
      icon: Calendar,
      label: t('event.date', 'التاريخ'),
      value: formatDate(event?.start_date),
    },
    {
      icon: Clock,
      label: t('event.time', 'الوقت'),
      value: formatTime(event?.start_date),
    },
    {
      icon: MapPin,
      label: t('event.location', 'الموقع'),
      value: event?.location || t('event.online', 'أونلاين'),
    },
    {
      icon: Users,
      label: t('event.capacity', 'السعة'),
      value: `${event?.capacity || 0} ${t('event.participants', 'مشارك')}`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-8"
    >
      <Card className="p-6 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 backdrop-blur-sm border border-primary-200">
        <h2 className="text-xl font-bold text-dark-500 mb-6 text-center">
          {t('event.details', 'تفاصيل الفعالية')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-primary-100 hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-dark-400">{item.label}</p>
                <p className="font-semibold text-dark-500">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
});

const RegistrationForm = memo(
  ({
    event,
    showRegistration,
    setShowRegistration,
    registrationForm,
    setRegistrationForm,
    registrationStatus,
    setRegistrationStatus,
    registrationMessage,
    setRegistrationMessage,
  }: {
    event: any;
    showRegistration: boolean;
    setShowRegistration: (show: boolean) => void;
    registrationForm: RegistrationForm;
    setRegistrationForm: (form: RegistrationForm) => void;
    registrationStatus: 'idle' | 'loading' | 'success' | 'error';
    setRegistrationStatus: (
      status: 'idle' | 'loading' | 'success' | 'error'
    ) => void;
    registrationMessage: string;
    setRegistrationMessage: (message: string) => void;
  }) => {
    const { t } = useTranslation();

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setRegistrationStatus('loading');
        setRegistrationMessage('');

        try {
          const response = await fetch('/api/events/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_id: event.id,
              ...registrationForm,
            }),
          });

          if (!response.ok) throw new Error('فشل في التسجيل');

          setRegistrationStatus('success');
          setRegistrationMessage(
            t('event.registration.success', 'تم التسجيل بنجاح!')
          );
          setRegistrationForm({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
          });

          setTimeout(() => {
            setShowRegistration(false);
            setRegistrationStatus('idle');
          }, 3000);
        } catch (error) {
          setRegistrationStatus('error');
          setRegistrationMessage(
            t('event.registration.error', 'حدث خطأ أثناء التسجيل')
          );
        }
      },
      [
        event?.id,
        registrationForm,
        t,
        setRegistrationForm,
        setShowRegistration,
        setRegistrationStatus,
      ]
    );

    return (
      <AnimatePresence>
        {showRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRegistration(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-dark-500 mb-4 text-center">
                {t('event.registration.title', 'تسجيل في الفعالية')}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('event.registration.firstName', 'الاسم الأول')}
                    type="text"
                    value={registrationForm.firstName}
                    onChange={(e) =>
                      setRegistrationForm({
                        ...registrationForm,
                        firstName: e.target.value,
                      })
                    }
                    required
                    fullWidth
                  />
                  <Input
                    label={t('event.registration.lastName', 'الاسم الأخير')}
                    type="text"
                    value={registrationForm.lastName}
                    onChange={(e) =>
                      setRegistrationForm({
                        ...registrationForm,
                        lastName: e.target.value,
                      })
                    }
                    required
                    fullWidth
                  />
                </div>

                <Input
                  label={t('event.registration.email', 'البريد الإلكتروني')}
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      email: e.target.value,
                    })
                  }
                  required
                  fullWidth
                />

                <Input
                  label={t('event.registration.phone', 'رقم الهاتف')}
                  type="tel"
                  value={registrationForm.phone}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      phone: e.target.value,
                    })
                  }
                  required
                  fullWidth
                />

                <div>
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    {t('event.registration.message', 'رسالة (اختياري)')}
                  </label>
                  <textarea
                    rows={3}
                    value={registrationForm.message}
                    onChange={(e) =>
                      setRegistrationForm({
                        ...registrationForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400 bg-white resize-none"
                    placeholder={t(
                      'event.registration.messagePlaceholder',
                      'أي رسالة إضافية...'
                    )}
                  />
                </div>

                {registrationMessage && (
                  <Alert
                    type={
                      registrationStatus === 'success' ? 'success' : 'error'
                    }
                    className="mt-4"
                  >
                    {registrationMessage}
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRegistration(false)}
                    className="flex-1"
                  >
                    {t('common.cancel', 'إلغاء')}
                  </Button>
                  <Button
                    type="submit"
                    loading={registrationStatus === 'loading'}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  >
                    {t('event.registration.submit', 'تسجيل')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

const EventDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isRTL = i18n.dir() === 'rtl';

  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [registrationStatus, setRegistrationStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [registrationMessage, setRegistrationMessage] = useState('');

  // Fetch event details
  const {
    data: eventData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
  });

  const event = eventData?.data || eventData;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('section') === 'register') {
      const el = document.getElementById('register');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <UnifiedLoader type="centered" size="lg" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <Alert type="error">
          {t('event.notFound', 'لم يتم العثور على الفعالية')}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent-200 rounded-full blur-2xl opacity-25" />
      </motion.div>

      <SEO
        title={`${event.title} - منصة شبابنا`}
        description={event.description}
        type="website"
        keywords={['فعالية', event.title, 'منصة شبابنا']}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <section className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('common.back', 'العودة للفعاليات')}
            </Link>
          </motion.div>

          <EventHeader event={event} />
          <EventInfo event={event} />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              onClick={() => setShowRegistration(true)}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {t('event.register', 'تسجيل في الفعالية')}
            </Button>

            <ShareButtons
              variant="button"
              size="md"
              title={event.title}
              description={event.description}
              image={event.image}
              url={`${window.location.origin}/events/${event.id}`}
              className="border-primary-200 text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            />
          </motion.div>

          {/* Additional Info */}
          {event.additional_info && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="p-6 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 backdrop-blur-sm border border-primary-200">
                <h3 className="text-lg font-bold text-dark-500 mb-4">
                  {t('event.additionalInfo', 'معلومات إضافية')}
                </h3>
                <div className="prose prose-sm text-dark-400">
                  {event.additional_info}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Inline Registration Section */}
          <motion.div
            id="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8"
          >
            <Card className="p-6 border border-primary-200 bg-white/90 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-dark-500 mb-4 text-center">
                {t('event.registration.title', 'تسجيل في الفعالية')}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegistrationSubmit(e);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t('event.registration.firstName', 'الاسم الأول')}
                    type="text"
                    value={registrationForm.firstName}
                    onChange={(e) =>
                      setRegistrationForm({
                        ...registrationForm,
                        firstName: e.target.value,
                      })
                    }
                    required
                    fullWidth
                  />
                  <Input
                    label={t('event.registration.lastName', 'الاسم الأخير')}
                    type="text"
                    value={registrationForm.lastName}
                    onChange={(e) =>
                      setRegistrationForm({
                        ...registrationForm,
                        lastName: e.target.value,
                      })
                    }
                    required
                    fullWidth
                  />
                </div>
                <Input
                  label={t('event.registration.email', 'البريد الإلكتروني')}
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      email: e.target.value,
                    })
                  }
                  required
                  fullWidth
                />
                <Input
                  label={t('event.registration.phone', 'رقم الهاتف')}
                  type="tel"
                  value={registrationForm.phone}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      phone: e.target.value,
                    })
                  }
                  required
                  fullWidth
                />
                <div>
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    {t('event.registration.message', 'رسالة (اختياري)')}
                  </label>
                  <textarea
                    rows={3}
                    value={registrationForm.message}
                    onChange={(e) =>
                      setRegistrationForm({
                        ...registrationForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400 bg-white resize-none"
                  />
                </div>
                {registrationMessage && (
                  <Alert
                    type={
                      registrationStatus === 'success' ? 'success' : 'error'
                    }
                    className="mt-2"
                  >
                    {registrationMessage}
                  </Alert>
                )}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    loading={registrationStatus === 'loading'}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  >
                    {t('event.registration.submit', 'تسجيل')}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </section>
      </div>

      <RegistrationForm
        event={event}
        showRegistration={showRegistration}
        setShowRegistration={setShowRegistration}
        registrationForm={registrationForm}
        setRegistrationForm={setRegistrationForm}
        registrationStatus={registrationStatus}
        setRegistrationStatus={setRegistrationStatus}
        registrationMessage={registrationMessage}
        setRegistrationMessage={setRegistrationMessage}
      />
    </div>
  );
};

export default EventDetail;
