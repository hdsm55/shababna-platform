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
import { useNavigate, useLocation, Link } from 'react-router-dom';

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
        title={t('home.seo.title', 'منصة شبابنا العالمية - الصفحة الرئيسية')}
        description={t(
          'home.seo.description',
          'منصة شبابية عالمية للفعاليات والبرامج والتطوع.'
        )}
        type="website"
      />

      {/* Hero Section */}
      <section
        className="relative min-h-[65vh] flex items-center justify-center bg-gradient-to-b from-primary-100 via-white to-accent-50 overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
        aria-label={t('home.hero.aria', 'قسم البطل - مقدمة المنصة')}
      >
        {/* زخرفة هندسية خفيفة */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-15">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#E0E7FF"
              fillOpacity="0.25"
              d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </svg>
        </div>
        <div className="relative z-10 w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center gap-6 py-20">
          <h1
            className="text-5xl md:text-6xl font-extrabold text-primary-900 leading-tight drop-shadow mb-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
            tabIndex={0}
          >
            {t('home.hero.title', 'منصة شبابنا العالمية')}
          </h1>
          <p
            className="text-lg md:text-2xl text-primary-700 font-medium mb-2 max-w-2xl mx-auto focus:outline-none focus:ring-2 focus:ring-accent-400"
            tabIndex={0}
          >
            {t(
              'home.hero.subtitle',
              'نصنع الأثر معاً... حيث يلتقي الشباب المسلم في إسطنبول والعالم للإبداع والعمل التطوعي والتطوير.'
            )}
          </p>
          <p
            className="text-base md:text-lg text-neutral-700 mb-4 max-w-xl mx-auto"
            tabIndex={0}
          >
            {t(
              'home.hero.shortDesc',
              'منصة رقمية تجمع الشباب لصناعة التغيير الإيجابي عبر فعاليات وبرامج ملهمة.'
            )}
          </p>
          <div className="inline-block">
            <Button
              size="lg"
              className="px-10 py-4 text-xl font-bold shadow-lg bg-accent-500 hover:bg-accent-600 text-white focus:ring-4 focus:ring-accent-200 transition"
              aria-label={t('home.hero.cta', 'اكتشف برامجنا')}
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
          </div>
        </div>
      </section>

      {/* فاصل مرئي */}
      <div
        className="w-full h-12 bg-gradient-to-r from-primary-50 via-accent-100 to-white opacity-75 my-12 rounded-2xl"
        aria-hidden="true"
      ></div>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gradient-to-br from-white via-primary-50 to-accent-50"
      >
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl md:text-4xl font-bold text-primary-800 text-center mb-16"
            tabIndex={0}
          >
            {t('home.features.title', 'ماذا نقدم؟')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <Card className="flex flex-col items-center text-center gap-4 bg-white rounded-2xl shadow-lg border border-primary-100 p-10 focus-within:ring-2 focus-within:ring-accent-400 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent-100 via-primary-50 to-white shadow-inner mb-2">
                <Globe
                  className="w-10 h-10 text-accent-500"
                  aria-hidden="true"
                />
              </div>
              <h3
                className="text-xl font-semibold text-primary-700 mb-2"
                tabIndex={0}
              >
                {t('home.features.events.title', 'الفعاليات وورش العمل')}
              </h3>
              <p className="text-neutral-700 text-base mb-2" tabIndex={0}>
                {t(
                  'home.features.events.description',
                  'جلسات وورش تفاعلية لتطوير المهارات وبناء العلاقات.'
                )}
              </p>
              <img
                src="/images/youth-event.jpg"
                alt={t('home.features.events.imgAlt', 'ورش وفعاليات')}
                className="rounded-xl shadow w-full h-32 object-cover"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
              />
            </Card>
            <Card className="flex flex-col items-center text-center gap-4 bg-white rounded-2xl shadow-lg border border-primary-100 p-10 focus-within:ring-2 focus-within:ring-primary-400 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 via-accent-100 to-white shadow-inner mb-2">
                <Lightbulb
                  className="w-10 h-10 text-primary-500"
                  aria-hidden="true"
                />
              </div>
              <h3
                className="text-xl font-semibold text-primary-700 mb-2"
                tabIndex={0}
              >
                {t('home.features.programs.title', 'برامج تطويرية')}
              </h3>
              <p className="text-neutral-700 text-base mb-2" tabIndex={0}>
                {t(
                  'home.features.programs.description',
                  'برامج طويلة الأمد للقيادة والتطوير.'
                )}
              </p>
              <img
                src="/images/youth-program.jpg"
                alt={t('home.features.programs.imgAlt', 'برامج تطويرية')}
                className="rounded-xl shadow w-full h-32 object-cover"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
              />
            </Card>
            <Card className="flex flex-col items-center text-center gap-4 bg-white rounded-2xl shadow-lg border border-primary-100 p-10 focus-within:ring-2 focus-within:ring-green-400 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-100 via-primary-50 to-white shadow-inner mb-2">
                <HeartHandshake
                  className="w-10 h-10 text-green-500"
                  aria-hidden="true"
                />
              </div>
              <h3
                className="text-xl font-semibold text-primary-700 mb-2"
                tabIndex={0}
              >
                {t('home.features.community.title', 'مجتمع عالمي')}
              </h3>
              <p className="text-neutral-700 text-base mb-2" tabIndex={0}>
                {t(
                  'home.features.community.description',
                  'تواصل مع شباب من أنحاء العالم واصنع صداقات دائمة.'
                )}
              </p>
              <img
                src="/images/global-community.jpg"
                alt={t('home.features.community.imgAlt', 'مجتمع عالمي')}
                className="rounded-xl shadow w-full h-32 object-cover"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')}
              />
            </Card>
          </div>
        </div>
      </motion.section>

      {/* فاصل مرئي */}
      <div
        className="w-full h-12 bg-gradient-to-r from-primary-50 via-accent-50 to-white opacity-70 my-8 rounded-2xl"
        aria-hidden="true"
      ></div>

      {/* Latest Events Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-neutral-50"
      >
        <div className="container mx-auto px-4">
          <h2
            className="text-2xl font-semibold mb-12 text-primary-800 text-center"
            tabIndex={0}
          >
            {t('home.latestEvents', 'آخر الفعاليات')}
          </h2>
          {eventsLoading ? (
            <LoadingSpinner />
          ) : latestEvents.length === 0 ? (
            <Alert type="info">
              {t('home.noEvents', 'لا توجد فعاليات حالياً')}
            </Alert>
          ) : (
            <div className="grid md:grid-cols-3 gap-10">
              {latestEvents.map((event: any) => (
                <Card
                  key={event.id}
                  variant="default"
                  padding="lg"
                  className="flex flex-col gap-3 rounded-2xl shadow-md border border-primary-50 hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-accent-400"
                >
                  <div
                    className="font-bold text-lg mb-1 text-primary-700"
                    tabIndex={0}
                  >
                    {event.title}
                  </div>
                  <div className="text-sm text-neutral-600 mb-1" tabIndex={0}>
                    {event.location} | {event.start_date}
                  </div>
                  <div
                    className="text-sm text-neutral-700 mb-3 line-clamp-3"
                    tabIndex={0}
                  >
                    {event.description}
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    tabIndex={0}
                    aria-label={t('home.viewDetails', 'عرض التفاصيل')}
                  >
                    <Button
                      size="sm"
                      className="w-full focus:shadow-lg focus:shadow-accent-200"
                    >
                      {t('home.viewDetails', 'عرض التفاصيل')}
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Latest Programs Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        id="programs"
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <h2
            className="text-2xl font-semibold mb-12 text-primary-800 text-center"
            tabIndex={0}
          >
            {t('home.latestPrograms', 'آخر البرامج')}
          </h2>
          {programsLoading ? (
            <LoadingSpinner />
          ) : latestPrograms.length === 0 ? (
            <Alert type="info">
              {t('home.noPrograms', 'لا توجد برامج حالياً')}
            </Alert>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              {latestPrograms.map((program: Program) => (
                <Card
                  key={program.id}
                  variant="default"
                  padding="lg"
                  className="flex flex-col gap-3 rounded-2xl shadow-md border border-primary-50 hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-400"
                >
                  <div
                    className="font-bold text-lg mb-1 text-primary-700"
                    tabIndex={0}
                  >
                    {program.title}
                  </div>
                  <div className="text-sm text-neutral-600 mb-1" tabIndex={0}>
                    {program.category}
                  </div>
                  <div
                    className="text-sm text-neutral-700 mb-3 line-clamp-3"
                    tabIndex={0}
                  >
                    {program.description}
                  </div>
                  <Link
                    to={`/programs/${program.id}`}
                    tabIndex={0}
                    aria-label={t('home.viewDetails', 'عرض التفاصيل')}
                  >
                    <Button
                      size="sm"
                      className="w-full focus:shadow-lg focus:shadow-primary-200"
                    >
                      {t('home.viewDetails', 'عرض التفاصيل')}
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-primary-50"
      >
        <div className="container mx-auto px-4 max-w-xl">
          <h2
            className="text-xl font-semibold mb-8 text-primary-800 text-center"
            tabIndex={0}
          >
            {t('home.newsletter.title', 'اشترك في النشرة البريدية')}
          </h2>
          <form
            onSubmit={handleNewsletter}
            className="flex flex-col md:flex-row gap-4 items-center"
            aria-label={t('home.newsletter.formAria', 'نموذج النشرة البريدية')}
          >
            <Input
              type="email"
              placeholder={t(
                'home.newsletter.placeholder',
                'أدخل بريدك الإلكتروني'
              )}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              fullWidth
              aria-label={t(
                'home.newsletter.placeholder',
                'أدخل بريدك الإلكتروني'
              )}
            />
            <Button
              type="submit"
              size="md"
              disabled={newsletterStatus === 'loading'}
              aria-busy={newsletterStatus === 'loading'}
              className="w-full md:w-auto bg-accent-500 hover:bg-accent-600 text-white font-bold focus:shadow-lg focus:shadow-accent-200"
            >
              {newsletterStatus === 'loading'
                ? t('home.newsletter.loading', 'جاري الإرسال...')
                : t('home.newsletter.cta', 'اشترك')}
            </Button>
          </form>
          {newsletterStatus !== 'idle' && (
            <Alert
              type={newsletterStatus === 'success' ? 'success' : 'error'}
              className="mt-4"
              aria-live="polite"
            >
              {newsletterMsg}
            </Alert>
          )}
        </div>
      </motion.section>

      {/* Modal Example */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={t('home.hero.cta', 'اكتشف برامجنا')}
        aria-label={t('home.hero.cta', 'اكتشف برامجنا')}
      >
        <div className="text-center p-6">
          <div className="text-lg mb-4">
            {t('home.hero.modalText', 'اكتشف برامجنا المميزة!')}
          </div>
          <Button onClick={() => setShowModal(false)}>
            {t('home.hero.close', 'إغلاق')}
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
