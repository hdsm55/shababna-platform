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
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Phone,
  Mail,
  Globe,
  User,
  CheckCircle,
  XCircle,
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

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationStatus('loading');

    try {
      // إرسال البيانات الفعلية للـ API
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
        // إعادة تعيين النموذج
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error">
          {t('eventDetail.error', 'حدث خطأ أثناء جلب تفاصيل الفعالية.')}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={`${event.title} - منصة شبابنا العالمية`}
        description={event.description}
        type="event"
      />

      {/* Back Button */}
      <section className="container mx-auto px-4 py-6">
        <Link to="/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('eventDetail.backToEvents', 'العودة إلى الفعاليات')}
          </Button>
        </Link>
      </section>

      {/* Event Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Image */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={event.image_url || '/images/event-placeholder.jpg'}
                alt={event.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
              />
            </motion.div>
          </div>

          {/* Event Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 sticky top-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusText(event.status)}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Event Title */}
                <h1 className="text-2xl font-bold text-primary-900 mb-4">
                  {event.title}
                </h1>

                {/* Event Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">
                        {formatDate(event.start_date)}
                        {event.end_date !== event.start_date &&
                          ` - ${formatDate(event.end_date)}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(event.start_date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3" />
                    <span>
                      {event.attendees} من {event.max_attendees || 'غير محدد'}{' '}
                      مشارك
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3" />
                    <span>{event.category}</span>
                  </div>
                </div>

                {/* Registration Button */}
                <Button
                  className="w-full mb-4"
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
                  <h3 className="font-semibold mb-2">
                    {t('eventDetail.contactInfo', 'معلومات التواصل')}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>+966 50 123 4567</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>events@shababna.com</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>www.shababna.com</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Description */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">
              {t('eventDetail.about', 'عن الفعالية')}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>

              {/* Additional Details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {t('eventDetail.whatToExpect', 'ما يمكن توقعه')}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      محاضرات قيمة ومفيدة
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      فرص للتواصل مع الشباب
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      شهادات مشاركة
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {t('eventDetail.requirements', 'المتطلبات')}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      التسجيل المسبق مطلوب
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      الحضور في الوقت المحدد
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      الالتزام بآداب الحضور
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">
              {t('eventDetail.register', 'تسجيل في الفعالية')}
            </h3>

            <form onSubmit={handleRegistration} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder={t('eventDetail.firstName', 'الاسم الأول')}
                  value={registrationForm.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="lastName"
                  placeholder={t('eventDetail.lastName', 'اسم العائلة')}
                  value={registrationForm.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Input
                name="email"
                type="email"
                placeholder={t('eventDetail.email', 'البريد الإلكتروني')}
                value={registrationForm.email}
                onChange={handleInputChange}
                required
              />

              <Input
                name="phone"
                placeholder={t('eventDetail.phone', 'رقم الجوال')}
                value={registrationForm.phone}
                onChange={handleInputChange}
                required
              />

              <textarea
                name="message"
                placeholder={t('eventDetail.message', 'رسالة (اختياري)')}
                value={registrationForm.message}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRegistration(false)}
                  className="flex-1"
                >
                  {t('eventDetail.cancel', 'إلغاء')}
                </Button>
                <Button
                  type="submit"
                  disabled={registrationStatus === 'loading'}
                  className="flex-1"
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
        </div>
      )}

      {/* Registration Status Alert */}
      {registrationStatus !== 'idle' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert
            type={registrationStatus === 'success' ? 'success' : 'error'}
            onClose={() => setRegistrationStatus('idle')}
          >
            {registrationMessage}
          </Alert>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
