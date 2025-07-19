import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import { Modal } from '../components/ui/Modal/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEvents } from '../services/eventsApi';
import { fetchPrograms } from '../services/programsApi';
import { Program } from '../types';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Users,
  Calendar,
  Globe,
  TrendingUp,
  Lightbulb,
  HeartHandshake,
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
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
      number: t('home.stats.membersNumber', { defaultValue: '1240' }),
      label: t('home.stats.members'),
      icon: <Users className="w-7 h-7 text-primary-500" />,
    },
    {
      number: t('home.stats.eventsNumber', { defaultValue: '87' }),
      label: t('home.stats.events'),
      icon: <Calendar className="w-7 h-7 text-accent-500" />,
    },
    {
      number: t('home.stats.countriesNumber', { defaultValue: '18' }),
      label: t('home.stats.countries'),
      icon: <Globe className="w-7 h-7 text-secondary-500" />,
    },
    {
      number: t('home.stats.programsNumber', { defaultValue: '12' }),
      label: t('home.stats.programs'),
      icon: <TrendingUp className="w-7 h-7 text-green-500" />,
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

  // Scroll to programs if state is set
  useEffect(() => {
    if (location.state && location.state.scrollToPrograms) {
      const el = document.getElementById('programs');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={t('home.seo.title')}
        description={t('home.seo.description')}
        type="website"
      />

      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-accent-50 to-white overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* زخرفة هندسية خفيفة */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-20">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#E0E7FF"
              fillOpacity="0.3"
              d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </svg>
        </div>
        <div className="relative z-10 w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center gap-8 py-16">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold text-primary-800 leading-tight drop-shadow-sm mb-4"
          >
            {t('home.hero.title', 'منصة شبابنا العالمية')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-2xl text-primary-700 font-medium mb-6 max-w-2xl mx-auto"
          >
            {t(
              'home.hero.subtitle',
              'نصنع الأثر معاً... حيث يلتقي الشباب المسلم في إسطنبول والعالم للإبداع والعمل التطوعي والتطوير.'
            )}
          </motion.p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, type: 'spring' }}
            className="inline-block"
          >
            <Button
              size="lg"
              className="px-8 py-3 text-lg font-bold shadow-lg animate-pulse focus:ring-4 focus:ring-primary-200"
              onClick={() => {
                if (location.pathname === '/') {
                  const el = document.getElementById('programs');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                } else {
                  navigate('/', { state: { scrollToPrograms: true } });
                }
              }}
            >
              {t('home.hero.cta', 'اكتشف برامجنا')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              variant="elevated"
              padding="md"
              className="flex flex-col items-center gap-2 shadow-md hover:shadow-xl transition-all"
            >
              <div className="mb-2">{stat.icon}</div>
              <CountUpNumber
                value={parseInt(stat.number)}
                className="text-3xl font-extrabold text-primary-600 mb-1"
              />
              <div className="text-base text-neutral-700 font-medium">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-white via-primary-50 to-accent-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 text-center mb-10">
            {t('home.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center gap-4 bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all">
              <Globe className="w-14 h-14 text-accent-500 mb-2" />
              <h3 className="text-xl font-semibold text-primary-700 mb-2">
                {t('home.features.events.title')}
              </h3>
              <p className="text-neutral-600 text-base mb-2">
                {t('home.features.events.description')}
              </p>
              <img
                src="/images/youth-event.jpg"
                alt="ورش وفعاليات"
                className="rounded-lg shadow w-full h-32 object-cover"
              />
            </div>
            <div className="flex flex-col items-center text-center gap-4 bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all">
              <Lightbulb className="w-14 h-14 text-primary-500 mb-2" />
              <h3 className="text-xl font-semibold text-primary-700 mb-2">
                {t('home.features.programs.title')}
              </h3>
              <p className="text-neutral-600 text-base mb-2">
                {t('home.features.programs.description')}
              </p>
              <img
                src="/images/youth-program.jpg"
                alt="برامج تطويرية"
                className="rounded-lg shadow w-full h-32 object-cover"
              />
            </div>
            <div className="flex flex-col items-center text-center gap-4 bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all">
              <HeartHandshake className="w-14 h-14 text-green-500 mb-2" />
              <h3 className="text-xl font-semibold text-primary-700 mb-2">
                {t('home.features.community.title')}
              </h3>
              <p className="text-neutral-600 text-base mb-2">
                {t('home.features.community.description')}
              </p>
              <img
                src="/images/global-community.jpg"
                alt="مجتمع عالمي"
                className="rounded-lg shadow w-full h-32 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Events Section */}
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 text-primary-700">
            {t('home.latestEvents')}
          </h2>
          {eventsLoading ? (
            <LoadingSpinner />
          ) : latestEvents.length === 0 ? (
            <Alert type="info">{t('home.noEvents')}</Alert>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {latestEvents.map((event: any) => (
                <Card key={event.id} variant="default" padding="md">
                  <div className="font-bold text-lg mb-2">{event.title}</div>
                  <div className="text-sm text-neutral-600 mb-2">
                    {event.location} | {event.start_date}
                  </div>
                  <div className="text-sm text-neutral-500 mb-4 line-clamp-3">
                    {event.description}
                  </div>
                  <a href={`/events/${event.id}`}>
                    <Button size="sm">{t('home.viewDetails')}</Button>
                  </a>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Programs Section */}
      <section id="programs" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 text-primary-700">
            {t('home.latestPrograms')}
          </h2>
          {programsLoading ? (
            <LoadingSpinner />
          ) : latestPrograms.length === 0 ? (
            <Alert type="info">{t('home.noPrograms')}</Alert>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {latestPrograms.map((program: Program) => (
                <Card key={program.id} variant="default" padding="md">
                  <div className="font-bold text-lg mb-2">{program.title}</div>
                  <div className="text-sm text-neutral-600 mb-2">
                    {program.category}
                  </div>
                  <div className="text-sm text-neutral-500 mb-4 line-clamp-3">
                    {program.description}
                  </div>
                  <a href={`/programs/${program.id}`}>
                    <Button size="sm">{t('home.viewDetails')}</Button>
                  </a>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="text-xl font-semibold mb-4 text-primary-700">
            {t('home.newsletter.title')}
          </h2>
          <form
            onSubmit={handleNewsletter}
            className="flex flex-col md:flex-row gap-4 items-center"
          >
            <Input
              type="email"
              placeholder={t('home.newsletter.placeholder')}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              size="md"
              disabled={newsletterStatus === 'loading'}
            >
              {newsletterStatus === 'loading'
                ? t('home.newsletter.loading')
                : t('home.newsletter.cta')}
            </Button>
          </form>
          {newsletterStatus !== 'idle' && (
            <Alert
              type={newsletterStatus === 'success' ? 'success' : 'error'}
              className="mt-4"
            >
              {newsletterMsg}
            </Alert>
          )}
        </div>
      </section>

      {/* Modal Example */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={t('home.hero.cta')}
      >
        <div className="text-center p-6">
          <div className="text-lg mb-4">{t('home.hero.modalText')}</div>
          <Button onClick={() => setShowModal(false)}>
            {t('home.hero.close')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// إضافة مكون عداد متحرك
const CountUpNumber: React.FC<{ value: number; className?: string }> = ({
  value,
  className,
}) => {
  const [count, setCount] = React.useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 900;
    const step = Math.ceil(value / 30);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, duration / 30);
    return () => clearInterval(interval);
  }, [value]);
  return <span className={className}>{count}</span>;
};

export default Home;
