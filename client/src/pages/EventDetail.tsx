import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
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
} from 'lucide-react';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}

const EventDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
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

  const calculateDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateRegistrationProgress = () => {
    if (!event?.max_attendees) return 0;
    return Math.min(((event.attendees || 0) / event.max_attendees) * 100, 100);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationStatus('loading');

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        }/events/${id}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: registrationForm.firstName,
            last_name: registrationForm.lastName,
            email: registrationForm.email,
            phone: registrationForm.phone,
            message: registrationForm.message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('فشل في التسجيل');
      }

      const result = await response.json();

      if (result.success) {
        setRegistrationStatus('success');
        setRegistrationMessage(
          'تم التسجيل بنجاح! ستتلقى تأكيداً عبر البريد الإلكتروني.'
        );
        setShowRegistration(false);
        setRegistrationForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        throw new Error(result.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationStatus('error');
      setRegistrationMessage('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRegistrationForm({
      ...registrationForm,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Alert type="error">
          {t('eventDetail.error', 'حدث خطأ أثناء جلب تفاصيل الفعالية.')}
        </Alert>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={`${event.title} - منصة شبابنا العالمية`}
        description={event.description}
        type="event"
      />

      {/* Enhanced Back Button */}
      <section className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/events">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('eventDetail.backToEvents', 'العودة إلى الفعاليات')}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Enhanced Event Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Event Image */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-96 bg-gradient-to-br from-slate-700 via-blue-700 to-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-8xl mb-4">
                      {getCategoryIcon(event.category)}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                    <p className="text-xl opacity-90">{event.category}</p>
                  </div>
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white bg-opacity-90 hover:bg-opacity-100"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusText(event.status)}
                  </span>
                </div>

                {/* Days Until Badge */}
                {event.status === 'upcoming' && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white bg-opacity-95 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                      {calculateDaysUntil(event.start_date)} يوم متبقي
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Enhanced Event Info Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 sticky top-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                      event.category
                    )}`}
                  >
                    {event.category}
                  </span>
                </div>

                {/* Event Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatDate(event.start_date)}
                        {event.end_date !== event.start_date &&
                          ` - ${formatDate(event.end_date)}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(event.start_date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 p-3 bg-green-50 rounded-lg">
                    <MapPin className="w-5 h-5 mr-3 text-green-500" />
                    <span className="font-medium">{event.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600 p-3 bg-purple-50 rounded-lg">
                    <Users className="w-5 h-5 mr-3 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.attendees} من {event.max_attendees || 'غير محدد'}{' '}
                        مشارك
                      </div>
                      {event.max_attendees && (
                        <div className="text-sm text-gray-500">
                          {Math.round(
                            ((event.attendees || 0) / event.max_attendees) * 100
                          )}
                          % ممتلئة
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 p-3 bg-orange-50 rounded-lg">
                    <Clock className="w-5 h-5 mr-3 text-orange-500" />
                    <span className="font-medium">{event.category}</span>
                  </div>
                </div>

                {/* Registration Progress */}
                {event.max_attendees && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        التسجيل
                      </span>
                      <span className="text-sm text-gray-500">
                        {calculateRegistrationProgress()}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${calculateRegistrationProgress()}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{event.attendees || 0} مسجل</span>
                      <span>{event.max_attendees} مقعد</span>
                    </div>
                  </div>
                )}

                {/* Registration Button */}
                <Button
                  className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                  onClick={() => setShowRegistration(true)}
                  disabled={
                    event.status === 'completed' || event.status === 'cancelled'
                  }
                >
                  {event.status === 'completed'
                    ? 'انتهت الفعالية'
                    : event.status === 'cancelled'
                    ? 'ألغيت الفعالية'
                    : 'سجل الآن'}
                </Button>

                {/* Contact Info */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 text-gray-900">
                    {t('eventDetail.contactInfo', 'معلومات التواصل')}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <Phone className="w-4 h-4 mr-2 text-green-500" />
                      <span>+905050505645</span>
                    </div>
                    <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      <span>info@shaababna.com</span>
                    </div>
                    <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <Globe className="w-4 h-4 mr-2 text-purple-500" />
                      <span>www.shababna.com</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Event Description */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-8 shadow-lg border-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-8 h-8 text-blue-500" />
              {t('eventDetail.about', 'عن الفعالية')}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {event.description}
              </p>

              {/* Enhanced Additional Details */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-6 h-6" />
                    {t('eventDetail.whatToExpect', 'ما يمكن توقعه')}
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>محاضرات قيمة ومفيدة من خبراء في المجال</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>فرص للتواصل مع الشباب والمهنيين</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>شهادات مشاركة معتمدة</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>مواد تعليمية مجانية</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-orange-800">
                    <Tag className="w-6 h-6" />
                    {t('eventDetail.requirements', 'المتطلبات')}
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                      <span>التسجيل المسبق مطلوب</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                      <span>الحضور في الوقت المحدد</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                      <span>الالتزام بآداب الحضور</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Enhanced Registration Modal */}
      <AnimatePresence>
        {showRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {t('eventDetail.register', 'تسجيل في الفعالية')}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRegistration(false)}
                  className="rounded-full w-8 h-8 p-0 flex-shrink-0"
                >
                  ×
                </Button>
              </div>

              {/* Event Summary - Compact for Mobile */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  {event.title}
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span>{formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleRegistration}
                className="space-y-3 sm:space-y-4"
              >
                {/* Name Fields - Stack on Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    name="firstName"
                    placeholder={t('eventDetail.firstName', 'الاسم الأول')}
                    value={registrationForm.firstName}
                    onChange={handleInputChange}
                    required
                    className="text-sm sm:text-base"
                  />
                  <Input
                    name="lastName"
                    placeholder={t('eventDetail.lastName', 'اسم العائلة')}
                    value={registrationForm.lastName}
                    onChange={handleInputChange}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <Input
                  name="email"
                  type="email"
                  placeholder={t('eventDetail.email', 'البريد الإلكتروني')}
                  value={registrationForm.email}
                  onChange={handleInputChange}
                  required
                  className="text-sm sm:text-base"
                />

                <Input
                  name="phone"
                  placeholder={t('eventDetail.phone', 'رقم الجوال')}
                  value={registrationForm.phone}
                  onChange={handleInputChange}
                  required
                  className="text-sm sm:text-base"
                />

                <textarea
                  name="message"
                  placeholder={t('eventDetail.message', 'رسالة (اختياري)')}
                  value={registrationForm.message}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm sm:text-base"
                  rows={2}
                />

                {/* Buttons - Stack on Mobile */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRegistration(false)}
                    className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                  >
                    {t('eventDetail.cancel', 'إلغاء')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={registrationStatus === 'loading'}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base py-2 sm:py-3"
                  >
                    {registrationStatus === 'loading' ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      t('eventDetail.submit', 'تأكيد التسجيل')
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Registration Status Alert */}
      <AnimatePresence>
        {registrationStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Alert
              type={registrationStatus === 'success' ? 'success' : 'error'}
              onClose={() => setRegistrationStatus('idle')}
            >
              {registrationMessage}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetail;
