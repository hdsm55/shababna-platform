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
  Tag,
} from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEventById, registerForEvent } from '../services/eventsApi';
import { http } from '../services/api';
import { Event } from '../types';
import {
  AccessibleSection,
  AccessibleCard,
  AccessibleButton,
  SkipToContent,
} from '../components/common/AccessibleComponents';
import DOMPurify from 'dompurify';
import { Modal } from '../components/ui/Modal/Modal';
import Skeleton from '../components/common/Skeleton';
import { DESIGN_SYSTEM } from '../components/common/DesignSystem';
import { useAuthStore } from '../store/authStore';

const EventDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registrants, setRegistrants] = useState<any[]>([]);
  const [loadingRegistrants, setLoadingRegistrants] = useState(false);
  const user = useAuthStore((s) => s.user);

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

  // جلب المسجلين للفعالية
  const fetchRegistrants = async () => {
    setLoadingRegistrants(true);
    try {
      const res = await http.get(`/events/${id}/registrants`);
      setRegistrants(res?.data?.data || []);
    } catch {
      setRegistrants([]);
    } finally {
      setLoadingRegistrants(false);
    }
  };

  useEffect(() => {
    if (id) fetchRegistrants();
  }, [id]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegistrationStatus('idle');
    try {
      if (!id) throw new Error('No event ID');
      const payload = {
        first_name: registrationForm.firstName.trim(),
        last_name: registrationForm.lastName.trim(),
        email: registrationForm.email.trim(),
        phone: registrationForm.phone.trim(),
      };
      if (!payload.first_name || !payload.last_name || !payload.email) {
        setRegistrationStatus('error');
        return;
      }
      const res = await registerForEvent(id, payload);
      if (res.success) {
        setRegistrationStatus('success');
        setRegistrationForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
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
    <div className="min-h-screen bg-neutral-50">
      {/* Cover Image */}
      <div className="w-full h-64 md:h-96 relative flex items-center justify-center mb-8">
        <motion.img
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          src={event.image_url || '/images/istanbul-mosque.jpg'}
          alt={event.title}
          className="w-full h-full object-cover object-center rounded-3xl shadow-2xl border-4 border-white"
          style={{ maxWidth: 900 }}
        />
        <span className="absolute top-6 left-6 bg-primary-600 text-white px-5 py-2 rounded-full text-base font-bold shadow-lg">
          {event.category}
        </span>
      </div>
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-800 mb-4 text-center drop-shadow-sm">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-6 mb-8 justify-center text-neutral-700 text-base">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow">
              <Calendar className="w-5 h-5 text-primary-500" />{' '}
              {event.start_date}
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow">
              <MapPin className="w-5 h-5 text-accent-500" /> {event.location}
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow">
              <Users className="w-5 h-5 text-green-500" />{' '}
              {event.max_attendees || 'غير محدد'} مشارك
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow">
              <Tag className="w-5 h-5 text-secondary-500" /> {event.status}
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-neutral-800 bg-white rounded-2xl shadow p-8 mb-10 mx-auto">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(event.description),
              }}
            />
          </div>
          {/* Actions */}
          <div className="flex gap-4 mt-6 justify-center">
            <Button
              size="lg"
              variant="primary"
              onClick={() => setShowRegisterModal(true)}
            >
              سجل الآن
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                navigator.share
                  ? navigator.share({
                      title: event.title,
                      url: window.location.href,
                    })
                  : window.open(
                      `https://wa.me/?text=${encodeURIComponent(
                        event.title + ' ' + window.location.href
                      )}`
                    )
              }
            >
              مشاركة
            </Button>
          </div>
        </motion.div>
        {/* نموذج التسجيل في Modal */}
        <Modal
          open={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="التسجيل في الفعالية"
        >
          <form onSubmit={handleRegistration} className="space-y-4 p-2">
            <div className="flex gap-2">
              <Input
                label="الاسم الأول"
                value={registrationForm.firstName}
                onChange={(e) =>
                  setRegistrationForm((f) => ({
                    ...f,
                    firstName: e.target.value,
                  }))
                }
                required
                fullWidth
              />
              <Input
                label="اسم العائلة"
                value={registrationForm.lastName}
                onChange={(e) =>
                  setRegistrationForm((f) => ({
                    ...f,
                    lastName: e.target.value,
                  }))
                }
                required
                fullWidth
              />
            </div>
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={registrationForm.email}
              onChange={(e) =>
                setRegistrationForm((f) => ({ ...f, email: e.target.value }))
              }
              required
              fullWidth
            />
            <Input
              label="رقم الجوال"
              value={registrationForm.phone}
              onChange={(e) =>
                setRegistrationForm((f) => ({ ...f, phone: e.target.value }))
              }
              fullWidth
            />
            {registrationStatus === 'success' && (
              <Alert type="success">تم التسجيل بنجاح!</Alert>
            )}
            {registrationStatus === 'error' && (
              <Alert type="error">حدث خطأ أثناء التسجيل. حاول مرة أخرى.</Alert>
            )}
            <div className="flex gap-2 justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegisterModal(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" variant="primary" loading={isRegistering}>
                تأكيد التسجيل
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default EventDetail;
