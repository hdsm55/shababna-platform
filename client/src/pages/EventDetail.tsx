import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Skeleton } from '../components/ui/Skeleton';
import { fetchEventById, registerForEvent } from '../services/eventsApi';
import { Event } from '../types';
import clsx from 'clsx';

const EventDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
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
  const isRTL = i18n.dir() === 'rtl';

  // Query configuration
  const eventQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
    retry: 1,
  });

  const { data: eventData, isLoading, isError, error } = eventQuery;
  const event: Event | undefined =
    eventData && 'data' in eventData ? (eventData.data as Event) : undefined;

  // Check if registration is possible
  const canRegister =
    event !== undefined &&
    event.status === 'upcoming' &&
    (!event.max_attendees ||
      (event.current_attendees || 0) < event.max_attendees);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !canRegister) return;

    try {
      setIsRegistering(true);
      if (event) {
        await registerForEvent(event.id, registrationForm);
      }
      setRegistrationStatus('success');
    } catch (error) {
      setRegistrationStatus('error');
      console.error('Registration failed:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    setRegistrationStatus('idle');
  }, [id]);

  // Render registration form
  const renderRegistrationForm = () => {
    if (event?.status !== 'upcoming' || !canRegister) {
      return (
        <Alert
          variant="info"
          title={t('events.registration.closed.title')}
          description={t('events.registration.closed.description')}
        />
      );
    }

    return (
      <form
        onSubmit={handleRegistration}
        className="space-y-4"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Input
          label={t('common.firstName')}
          placeholder={t('common.enterFirstName')}
          value={registrationForm.firstName}
          onChange={(e) =>
            setRegistrationForm({
              ...registrationForm,
              firstName: e.target.value,
            })
          }
          required
        />
        <Input
          label={t('common.lastName')}
          placeholder={t('common.enterLastName')}
          value={registrationForm.lastName}
          onChange={(e) =>
            setRegistrationForm({
              ...registrationForm,
              lastName: e.target.value,
            })
          }
          required
        />
        <Input
          label={t('common.email')}
          placeholder={t('common.enterEmail')}
          type="email"
          value={registrationForm.email}
          onChange={(e) =>
            setRegistrationForm({ ...registrationForm, email: e.target.value })
          }
          required
        />
        <Input
          label={t('common.phone')}
          placeholder={t('common.enterPhone')}
          value={registrationForm.phone}
          onChange={(e) =>
            setRegistrationForm({ ...registrationForm, phone: e.target.value })
          }
          required
        />
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isRegistering}
            disabled={registrationStatus === 'success'}
          >
            {t('events.registration.submit')}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              setRegistrationForm({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
              })
            }
          >
            {t('common.cancel')}
          </Button>
        </div>
        {registrationStatus === 'success' && (
          <Alert
            variant="success"
            title={t('events.registration.success.title')}
            description={t('events.registration.success.description')}
          />
        )}
        {registrationStatus === 'error' && (
          <Alert
            variant="error"
            title={t('common.error')}
            description={t('events.registration.error')}
          />
        )}
      </form>
    );
  };

  // Render event details
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <Alert
        variant="error"
        title={t('common.error')}
        description={t('events.notFound')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
        {/* Main Info */}
        <Card
          variant="elevated"
          dir={isRTL ? 'rtl' : 'ltr'}
          className="md:col-span-2"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-primary" />
            <span className="font-bold text-lg">{event.title}</span>
            <span className="ml-2 px-3 py-1 text-xs rounded-full bg-accent text-white">
              {event.category}
            </span>
            <span className="ml-2 px-3 py-1 text-xs rounded-full bg-primary text-white">
              {event.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-secondary text-sm mb-2">
            <MapPin className="text-accent" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-3 text-secondary text-sm mb-2">
            <span className="text-primary">
              {format(new Date(event.start_date), 'PPP')}
            </span>
            {event.end_date && (
              <span className="text-secondary">
                {t('events.until')} {format(new Date(event.end_date), 'PPP')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-secondary text-sm mb-2">
            <Users className="text-accent" />
            <span>
              {t('events.attendance', {
                current: event.current_attendees || 0,
                max: event.max_attendees || 0,
              })}
            </span>
          </div>
          <div className="flex gap-4 mt-6">
            {/* تم حذف زر التسجيل */}
            <Button variant="outline">{t('events.share')}</Button>
          </div>
        </Card>
        {/* تم حذف نموذج التسجيل بالكامل */}
      </div>
    </div>
  );
};

export default EventDetail;
