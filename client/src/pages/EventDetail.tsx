import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { useAlert } from '../components/common/AlertProvider';
import {
  useUnifiedLoading,
  PageLoader,
} from '../components/common/UnifiedLoadingStates';
import UnifiedAlert from '../components/common/UnifiedAlert';
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

  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const { success, error: showError } = useAlert();
  const { withButtonLoading } = useUnifiedLoading();

  // Local alert state for form notifications
  const [localAlert, setLocalAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

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
  };

  const formatTime = (dateString: string) => {
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

    await withButtonLoading(async () => {
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
          setLocalAlert({
            type: 'success',
            message:
              'تم تسجيلك في الفعالية بنجاح! ستتلقى تأكيداً عبر البريد الإلكتروني.',
          });
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
      } catch (err) {
        console.error('Registration error:', err);
        setLocalAlert({
          type: 'error',
          message: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.',
        });
      }
    });
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
      <PageLoader
        message="جاري تحميل تفاصيل الفعالية..."
        fullScreen={true}
        variant="brand"
      />
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">خطأ في التحميل</h3>
          <p className="text-red-700">
            {t('eventDetail.error', 'حدث خطأ أثناء جلب تفاصيل الفعالية.')}
          </p>
        </div>
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

      {/* Back Button */}
      <section className="container mx-auto px-4 py-4">
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

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-80 md:h-96 rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={event.image_url || '/images/events-default.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/images/events-default.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white bg-opacity-90 hover:bg-opacity-100"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusText(event.status)}
                  </span>
                </div>

                {event.status === 'upcoming' && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white bg-opacity-95 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                      {calculateDaysUntil(event.start_date)} يوم متبقي
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Event Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 shadow-xl border-0">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(
                        event.category
                      )}`}
                    >
                      {event.category}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    {event.title}
                  </h1>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center p-6 bg-blue-50 rounded-2xl">
                    <Calendar className="w-6 h-6 mr-4 text-blue-500" />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {formatDate(event.start_date)}
                        {event.end_date !== event.start_date &&
                          ` - ${formatDate(event.end_date)}`}
                      </div>
                      <div className="text-gray-600">
                        {formatTime(event.start_date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 bg-green-50 rounded-2xl">
                    <MapPin className="w-6 h-6 mr-4 text-green-500" />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        الموقع
                      </div>
                      <div className="text-gray-600">{event.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 bg-purple-50 rounded-2xl">
                    <Users className="w-6 h-6 mr-4 text-purple-500" />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {event.attendees} من {event.max_attendees || 'غير محدد'}{' '}
                        مشارك
                      </div>
                      {event.max_attendees && (
                        <div className="text-gray-600">
                          {Math.round(
                            ((event.attendees || 0) / event.max_attendees) * 100
                          )}
                          % ممتلئة
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center p-6 bg-orange-50 rounded-2xl">
                    <Clock className="w-6 h-6 mr-4 text-orange-500" />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        نوع الفعالية
                      </div>
                      <div className="text-gray-600">{event.category}</div>
                    </div>
                  </div>
                </div>

                {/* Registration Progress */}
                {event.max_attendees && (
                  <div className="p-6 bg-gray-50 rounded-2xl mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-900 text-lg">
                        حالة التسجيل
                      </span>
                      <span className="text-gray-600">
                        {calculateRegistrationProgress()}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${calculateRegistrationProgress()}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-gray-600 mt-3">
                      <span>{event.attendees || 0} مسجل</span>
                      <span>{event.max_attendees} مقعد متاح</span>
                    </div>
                  </div>
                )}

                {/* Event Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-500" />
                    {t('eventDetail.about', 'عن الفعالية')}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {event.description}
                  </p>

                  {/* Enhanced Additional Details */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-800">
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

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-800">
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

                {/* Contact Information */}
                <div className="border-t pt-8">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
                    <Phone className="w-6 h-6 text-blue-500" />
                    معلومات التواصل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href="tel:+905050505645"
                      className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <Phone className="w-5 h-5 mr-3 text-green-500" />
                      <span className="font-semibold text-green-700">
                        +905050505645
                      </span>
                    </a>
                    <a
                      href="mailto:info@shababna.com"
                      className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-3 text-blue-500" />
                      <span className="font-semibold text-blue-700">
                        info@shababna.com
                      </span>
                    </a>
                    <a
                      href="https://maps.app.goo.gl/yz4Nc1RmLt6CuTh47"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <MapPin className="w-5 h-5 mr-3 text-red-500" />
                      <span className="font-semibold text-red-700">
                        موقعنا على الخريطة
                      </span>
                    </a>
                    <a
                      href="https://shababna.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                      <Globe className="w-5 h-5 mr-3 text-purple-500" />
                      <span className="font-semibold text-purple-700">
                        www.shababna.com
                      </span>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 sticky top-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    تسجيل في الفعالية
                  </h2>
                  <p className="text-gray-600">أكمل البيانات التالية للتسجيل</p>
                </div>

                {/* Event Summary */}
                <div className="bg-white p-4 rounded-xl mb-6 border border-blue-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>{formatTime(event.start_date)}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleRegistration} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الاسم الأول <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="firstName"
                        placeholder="أدخل اسمك الأول"
                        value={registrationForm.firstName}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم العائلة <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="lastName"
                        placeholder="أدخل اسم العائلة"
                        value={registrationForm.lastName}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={registrationForm.email}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم الجوال <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="phone"
                      placeholder="+90 505 050 56 45"
                      value={registrationForm.phone}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رسالة (اختياري)
                    </label>
                    <textarea
                      name="message"
                      placeholder="اكتب أي رسالة إضافية..."
                      value={registrationForm.message}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-24"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 h-14 shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>تأكيد التسجيل</span>
                    </div>
                  </Button>

                  {/* Local Alert */}
                  {localAlert.type && (
                    <UnifiedAlert
                      type={localAlert.type}
                      message={localAlert.message}
                      position="button-bottom"
                      duration={5000}
                      onClose={() => setLocalAlert({ type: null, message: '' })}
                    />
                  )}
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
