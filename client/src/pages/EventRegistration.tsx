import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  User,
  AlertCircle,
} from 'lucide-react';

import { fetchEventById } from '../services/eventsApi';
import { registerForEvent } from '../services/eventsApi';
import { Event } from '../types';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Input } from '../components/ui/Input/InputSimple';
import { Card } from '../components/ui/Card/Card';
import { Alert } from '../components/common/DesignSystem';

const EventRegistration: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  // جلب بيانات الفعالية
  const {
    data: event,
    isLoading: isLoadingEvent,
    isError: isEventError,
    error: eventError,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventById(eventId!),
    enabled: !!eventId,
  });

  // تسجيل في الفعالية
  const registerMutation = useMutation({
    mutationFn: registerForEvent,
    onSuccess: () => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setRegistrationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;

    registerMutation.mutate({
      eventId,
      ...registrationForm,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  const getEventIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'conference':
        return '🎤';
      case 'workshop':
        return '🔧';
      case 'seminar':
        return '📚';
      case 'training':
        return '💡';
      case 'networking':
        return '🤝';
      default:
        return '📅';
    }
  };

  const getStatusColor = (status: string) => {
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

  // Loading State
  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-8 max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary-600 mb-2">
              جاري تحميل بيانات الفعالية...
            </h3>
            <p className="text-dark-400 text-sm">يرجى الانتظار قليلاً...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isEventError || !event) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-error-100 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-error-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              حدث خطأ في تحميل الفعالية
            </h3>
            <p className="text-gray-600 mb-6">
              {eventError?.message || 'لم نتمكن من العثور على الفعالية'}
            </p>
            <Button
              onClick={() => navigate('/events')}
              className="bg-primary-500 text-white hover:bg-primary-600"
            >
              العودة إلى الفعاليات
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-success-100">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                تم التسجيل بنجاح! 🎉
              </h1>
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                تم تسجيلك في فعالية{' '}
                <span className="font-semibold text-primary-600">
                  "{event.title}"
                </span>{' '}
                بنجاح. ستتلقى تأكيداً عبر البريد الإلكتروني قريباً.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/events')}
                  className="w-full bg-primary-500 text-white hover:bg-primary-600"
                >
                  العودة إلى الفعاليات
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="w-full border-primary-200 text-primary-600 hover:bg-primary-50"
                >
                  الذهاب إلى لوحة التحكم
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <SEO
        title={`تسجيل في ${event.title} - منصة شبابنا`}
        description={`سجل في فعالية ${event.title}`}
        type="website"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => navigate('/events')}
            variant="ghost"
            className="text-gray-700 hover:bg-white/50 flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة إلى الفعاليات
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              تسجيل في الفعالية
            </h1>
            <p className="text-gray-600">
              أكمل البيانات التالية للتسجيل في الفعالية
            </p>
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* معلومات الفعالية */}
            <div className="space-y-6">
              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-primary-100">
                {/* Event Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-2xl">
                      {getEventIcon(event.category)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {getStatusText(event.status)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {event.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary-700 bg-primary-50 px-4 py-3 rounded-xl">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-semibold">التاريخ</div>
                      <div className="text-sm">
                        {formatDate(event.start_date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-secondary-700 bg-secondary-50 px-4 py-3 rounded-xl">
                    <Clock className="w-5 h-5 text-secondary-600" />
                    <div>
                      <div className="font-semibold">الوقت</div>
                      <div className="text-sm">
                        {formatTime(event.start_date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-accent-700 bg-accent-50 px-4 py-3 rounded-xl">
                    <MapPin className="w-5 h-5 text-accent-600" />
                    <div>
                      <div className="font-semibold">الموقع</div>
                      <div className="text-sm">{event.location}</div>
                    </div>
                  </div>

                  {event.max_attendees && (
                    <div className="flex items-center gap-3 text-gray-700 bg-gray-50 px-4 py-3 rounded-xl">
                      <Users className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-semibold">عدد المشاركين</div>
                        <div className="text-sm">
                          {event.attendees || 0} / {event.max_attendees} مشارك
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* نموذج التسجيل */}
            <div>
              <Card className="p-6 bg-white rounded-2xl shadow-lg border border-primary-100">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    بيانات التسجيل
                  </h3>
                  <p className="text-gray-600">
                    أكمل البيانات التالية للتسجيل في الفعالية
                  </p>
                </div>

                {registerMutation.isError && (
                  <Alert
                    type="error"
                    title="خطأ في التسجيل"
                    description={
                      registerMutation.error?.message || 'حدث خطأ أثناء التسجيل'
                    }
                    className="mb-6"
                  />
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="الاسم الأول"
                      value={registrationForm.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      required
                      placeholder="أدخل اسمك الأول"
                      icon={<User className="w-4 h-4" />}
                      className="focus:border-primary-500 focus:ring-primary-500"
                    />
                    <Input
                      label="اسم العائلة"
                      value={registrationForm.lastName}
                      onChange={(e) =>
                        handleInputChange('lastName', e.target.value)
                      }
                      required
                      placeholder="أدخل اسم العائلة"
                      icon={<User className="w-4 h-4" />}
                      className="focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <Input
                    label="البريد الإلكتروني"
                    type="email"
                    value={registrationForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="example@email.com"
                    icon={<Mail className="w-4 h-4" />}
                    className="focus:border-primary-500 focus:ring-primary-500"
                  />

                  <Input
                    label="رقم الهاتف"
                    type="tel"
                    value={registrationForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    placeholder="+966 50 123 4567"
                    icon={<Phone className="w-4 h-4" />}
                    className="focus:border-primary-500 focus:ring-primary-500"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={registerMutation.isPending}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-lg"
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري التسجيل...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        تأكيد التسجيل
                      </div>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
