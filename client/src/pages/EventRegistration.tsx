import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';

import { fetchEventById, registerForEvent } from '../services/eventsApi';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/ui/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EventRegistration: React.FC = () => {
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  console.log('params:', params);
  console.log('eventId from params:', eventId);
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch event details with real-time updates
  const {
    data: eventData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventById(eventId!),
    enabled: !!eventId,
    retry: 1,
    staleTime: 0,
    refetchInterval: 30000,
  });

  const event = eventData?.data;

  const handleInputChange = (field: string, value: string) =>
    setRegistrationForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('تسجيل في الفعالية:', event?.title);
      console.log('بيانات التسجيل:', registrationForm);
      console.log('eventId:', eventId);

      if (!eventId) {
        throw new Error('معرف الفعالية غير موجود');
      }

      const response = await registerForEvent(eventId, {
        first_name: registrationForm.firstName,
        last_name: registrationForm.lastName,
        email: registrationForm.email,
        phone: registrationForm.phone,
        message: registrationForm.message,
      });

      console.log('استجابة التسجيل:', response);

      await refetch();
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });

      setIsSuccess(true);
      setRegistrationForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('خطأ في التسجيل:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  const calculateRegistrationProgress = () => {
    if (!event?.max_attendees) return 0;
    return Math.min(((event.attendees || 0) / event.max_attendees) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Alert type="error" title={t('common.error', 'خطأ')}>
            {error?.message ||
              t('events.notFound', 'لم يتم العثور على الفعالية')}
          </Alert>
          <div className="mt-4 space-y-2">
            <p className="text-gray-600">
              {t(
                'events.registration.errorMessage',
                'حدث خطأ في تحميل بيانات الفعالية'
              )}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="primary" onClick={() => navigate('/events')}>
                {t('common.backToEvents', 'العودة للفعاليات')}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                {t('common.retry', 'إعادة المحاولة')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if event is completed or full
  const isCompleted = event.status === 'completed';
  const isFull =
    event.attendees >= (event.max_attendees || 0) &&
    (event.max_attendees || 0) > 0;
  const canRegister = !isCompleted && !isFull;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <SEO
        title={`تسجيل في ${event.title} - منصة شبابنا`}
        description={`سجل الآن في ${event.title}`}
        type="website"
      />

      {/* Enhanced Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/events')}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 border-white text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.back', 'رجوع')}
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {t('events.registration.title', 'تسجيل في الفعالية')}
              </h1>
              <p className="text-slate-200 mt-1">
                أكمل تسجيلك في الفعالية المختارة
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <Alert
                  type="success"
                  title={t('common.success', 'نجح التسجيل')}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>
                      {t(
                        'events.registration.successMessage',
                        'تم التسجيل بنجاح! ستتلقى تأكيداً عبر البريد الإلكتروني.'
                      )}
                    </span>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Event Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-8 shadow-xl border-0">
                  {/* Event Header */}
                  <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                          {event.title}
                        </h2>
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                              event.category
                            )}`}
                          >
                            {event.category}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {getStatusText(event.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-lg">
                      {event.description}
                    </p>
                  </div>

                  {/* Enhanced Event Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                      <Calendar className="w-6 h-6 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">التاريخ</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(event.start_date)}
                          {event.end_date !== event.start_date &&
                            ` - ${formatDate(event.end_date)}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatTime(event.start_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-green-50 rounded-xl">
                      <MapPin className="w-6 h-6 text-green-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">الموقع</p>
                        <p className="font-semibold text-gray-900">
                          {event.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                      <Users className="w-6 h-6 text-purple-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">المسجلون</p>
                        <p className="font-semibold text-gray-900">
                          {event.attendees || 0}
                          {event.max_attendees && ` / ${event.max_attendees}`}
                        </p>
                        {event.max_attendees && (
                          <p className="text-sm text-gray-600">
                            {Math.round(
                              ((event.attendees || 0) / event.max_attendees) *
                                100
                            )}
                            % ممتلئة
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-orange-50 rounded-xl">
                      <Clock className="w-6 h-6 text-orange-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">الفئة</p>
                        <p className="font-semibold text-gray-900">
                          {event.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Registration Progress */}
                  {event.max_attendees && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          التسجيل
                        </h3>
                        <span className="text-sm text-gray-600">
                          {calculateRegistrationProgress()}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${calculateRegistrationProgress()}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{event.attendees || 0} مسجل</span>
                        <span>{event.max_attendees} مقعد</span>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Registration Form */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm sticky top-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3">
                        {getCategoryIcon(event.category)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {t(
                          'events.registration.formTitle',
                          'تسجيل في الفعالية'
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {t(
                          'events.registration.formDescription',
                          'أدخل بياناتك للتسجيل في هذه الفعالية'
                        )}
                      </p>
                    </div>

                    {!canRegister ? (
                      <Alert
                        type="warning"
                        title={t(
                          'events.registration.unavailable',
                          'لا يمكن التسجيل'
                        )}
                      >
                        {isCompleted
                          ? t(
                              'events.registration.completed',
                              'هذه الفعالية مكتملة ولا يمكن التسجيل فيها'
                            )
                          : t(
                              'events.registration.full',
                              'هذه الفعالية ممتلئة ولا يمكن التسجيل فيها'
                            )}
                      </Alert>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label={t(
                              'events.registration.firstName',
                              'الاسم الأول'
                            )}
                            value={registrationForm.firstName}
                            onChange={(e) =>
                              handleInputChange('firstName', e.target.value)
                            }
                            required
                          />
                          <Input
                            label={t(
                              'events.registration.lastName',
                              'اسم العائلة'
                            )}
                            value={registrationForm.lastName}
                            onChange={(e) =>
                              handleInputChange('lastName', e.target.value)
                            }
                            required
                          />
                        </div>

                        <Input
                          label={t(
                            'events.registration.email',
                            'البريد الإلكتروني'
                          )}
                          type="email"
                          value={registrationForm.email}
                          onChange={(e) =>
                            handleInputChange('email', e.target.value)
                          }
                          required
                        />

                        <Input
                          label={t('events.registration.phone', 'رقم الهاتف')}
                          type="tel"
                          value={registrationForm.phone}
                          onChange={(e) =>
                            handleInputChange('phone', e.target.value)
                          }
                          required
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            رسالة (اختياري)
                          </label>
                          <textarea
                            value={registrationForm.message}
                            onChange={(e) =>
                              handleInputChange('message', e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={3}
                            placeholder="أضف رسالة أو ملاحظات..."
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <LoadingSpinner size="sm" />
                              {t('common.submitting', 'جاري التسجيل...')}
                            </div>
                          ) : (
                            t('events.registration.submit', 'تأكيد التسجيل')
                          )}
                        </Button>
                      </form>
                    )}

                    {/* Contact Info */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-3 text-gray-900">
                        معلومات التواصل
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                          <Phone className="w-4 h-4 mr-2 text-green-500" />
                          <span>+966 50 123 4567</span>
                        </div>
                        <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                          <Mail className="w-4 h-4 mr-2 text-blue-500" />
                          <span>events@shababna.com</span>
                        </div>
                        <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                          <Globe className="w-4 h-4 mr-2 text-purple-500" />
                          <span>www.shababna.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
