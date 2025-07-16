import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../services/eventsApi';
import { fetchPrograms } from '../services/programsApi';
import { Program } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { QuickActions } from '../components/ui/QuickActions';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Globe,
  ArrowRight,
  Zap,
  Target,
  Heart,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Play,
  Award,
  Shield,
  Mail,
  Users2,
  CalendarDays,
  BookOpen,
  Lightbulb,
  Handshake,
} from 'lucide-react';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const isRTL = i18n.dir() === 'rtl';

  // Fetch latest events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['latest-events'],
    queryFn: () => fetchEvents({ page: 1, limit: 3 }),
    staleTime: 5 * 60 * 1000,
  });
  const latestEvents = eventsData?.data?.items || [];

  // Fetch latest programs
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ['latest-programs'],
    queryFn: () => fetchPrograms({ page: 1, limit: 2 }),
    staleTime: 5 * 60 * 1000,
  });
  const latestPrograms = programsData?.data?.items || [];

  // Platform stats
  const stats = [
    {
      number: '500+',
      label: t('home.stats.members'),
      icon: Users2,
      color: 'primary',
      description: t('home.stats.membersDesc'),
    },
    {
      number: '50+',
      label: t('home.stats.events'),
      icon: CalendarDays,
      color: 'accent',
      description: t('home.stats.eventsDesc'),
    },
    {
      number: '25+',
      label: t('home.stats.countries'),
      icon: MapPin,
      color: 'secondary',
      description: t('home.stats.countriesDesc'),
    },
    {
      number: '10+',
      label: t('home.stats.programs'),
      icon: BookOpen,
      color: 'primary',
      description: t('home.stats.programsDesc'),
    },
  ];

  // Platform features
  const features = [
    {
      icon: Calendar,
      title: t('home.features.events.title'),
      description: t('home.features.events.description'),
      color: 'primary',
      link: '/events',
    },
    {
      icon: Target,
      title: t('home.features.programs.title'),
      description: t('home.features.programs.description'),
      color: 'accent',
      link: '/programs',
    },
    {
      icon: Handshake,
      title: t('home.features.community.title'),
      description: t('home.features.community.description'),
      color: 'secondary',
      link: '/join-us',
    },
  ];

  // Newsletter submit handler
  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    setNewsletterMsg('');
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1200));
      setNewsletterStatus('success');
      setNewsletterMsg(t('home.newsletter.success'));
      setNewsletterEmail('');
    } catch {
      setNewsletterStatus('error');
      setNewsletterMsg(t('home.newsletter.error'));
    }
    setTimeout(() => setNewsletterStatus('idle'), 4000);
  };

  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <SectionTitle
        title={t('home.hero.title')}
        description={t('home.hero.description')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="text-center mt-10"
      />
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center my-8">
        <QuickActions dir={isRTL ? 'rtl' : 'ltr'}>
          <Button variant="primary" as={Link} to="/events" icon={<Calendar />}>
            {t('home.cta.events')}
          </Button>
          <Button
            variant="outline"
            as={Link}
            to="/programs"
            icon={<BookOpen />}
          >
            {t('home.cta.programs')}
          </Button>
          <Button variant="ghost" as={Link} to="/join-us" icon={<Handshake />}>
            {t('home.cta.join')}
          </Button>
        </QuickActions>
      </div>
      {/* Stats Section */}
      <SectionTitle
        title={t('home.stats.title')}
        description={t('home.stats.description')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-8">
        {stats.map((stat, idx) => (
          <Card key={idx} variant="elevated" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-3xl text-${stat.color}`}>
                {React.createElement(stat.icon)}
              </span>
              <span className="text-2xl font-bold">{stat.number}</span>
            </div>
            <div className="text-lg font-semibold mb-1">{stat.label}</div>
            <div className="text-secondary text-sm">{stat.description}</div>
          </Card>
        ))}
      </div>
      {/* Features Section */}
      <SectionTitle
        title={t('home.features.title')}
        description={t('home.features.description')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {features.map((feature, idx) => (
          <Card key={idx} variant="hoverable" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-2xl text-${feature.color}`}>
                {React.createElement(feature.icon)}
              </span>
              <span className="text-lg font-bold">{feature.title}</span>
            </div>
            <div className="text-secondary text-sm mb-2">
              {feature.description}
            </div>
            <Button
              as={Link}
              to={feature.link}
              variant="outline"
              icon={<ChevronRight />}
            >
              {t('home.features.cta')}
            </Button>
          </Card>
        ))}
      </div>
      {/* Latest Events Section */}
      <SectionTitle
        title={t('home.latestEvents.title')}
        description={t('home.latestEvents.description')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {eventsLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} height={180} />
          ))
        ) : latestEvents.length === 0 ? (
          <Alert type="info">{t('home.latestEvents.empty')}</Alert>
        ) : (
          latestEvents.map((event: any) => (
            <Card key={event.id} variant="base" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-primary" />
                <span className="font-bold">{event.title}</span>
              </div>
              <div className="text-secondary text-sm mb-2">{event.date}</div>
              <Button
                as={Link}
                to={`/events/${event.id}`}
                variant="primary"
                icon={<ChevronRight />}
              >
                {t('home.latestEvents.cta')}
              </Button>
            </Card>
          ))
        )}
      </div>
      {/* Latest Programs Section */}
      <SectionTitle
        title={t('home.latestPrograms.title')}
        description={t('home.latestPrograms.description')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {programsLoading ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <Skeleton key={idx} height={180} />
          ))
        ) : latestPrograms.length === 0 ? (
          <Alert type="info">{t('home.latestPrograms.empty')}</Alert>
        ) : (
          latestPrograms.map((program: Program) => (
            <Card key={program.id} variant="base" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-accent" />
                <span className="font-bold">{program.title}</span>
              </div>
              <div className="text-secondary text-sm mb-2">
                {program.start_date}
              </div>
              <Button
                as={Link}
                to={`/programs/${program.id}`}
                variant="primary"
                icon={<ChevronRight />}
              >
                {t('home.latestPrograms.cta')}
              </Button>
            </Card>
          ))
        )}
      </div>
      {/* Newsletter Section */}
      <SectionTitle
        title={t('home.newsletter.title')}
        description={t('home.newsletter.description')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      <form
        onSubmit={handleNewsletter}
        className="max-w-lg mx-auto flex flex-col gap-4 my-8"
      >
        <Input
          type="email"
          label={t('home.newsletter.email')}
          value={newsletterEmail}
          onChange={(e) => setNewsletterEmail(e.target.value)}
          required
          icon={<Mail />}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <Button
          type="submit"
          variant="primary"
          loading={newsletterStatus === 'loading'}
        >
          {t('home.newsletter.cta')}
        </Button>
        {newsletterStatus !== 'idle' && (
          <Alert type={newsletterStatus === 'success' ? 'success' : 'error'}>
            {newsletterMsg}
          </Alert>
        )}
      </form>
      {/* Modal Example */}
      <Button
        variant="outline"
        onClick={() => setShowModal(true)}
        className="mx-auto block my-8"
      >
        {t('home.openModal')}
      </Button>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={t('home.modal.title')}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="text-center py-6">
          <p className="mb-4">{t('home.modal.content')}</p>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            {t('home.modal.close')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
