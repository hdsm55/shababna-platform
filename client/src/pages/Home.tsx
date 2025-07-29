import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button/Button';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardSubtitle,
  CardImage,
  CardActions,
} from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import { Modal } from '../components/ui/Modal/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEvents } from '../services/eventsApi';
import { fetchPrograms } from '../services/programsApi';
import { Program } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Users,
  Calendar,
  Globe,
  TrendingUp,
  Lightbulb,
  HeartHandshake,
  ArrowRight,
  Star,
  Award,
  Target,
  Zap,
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

  // Debug: طباعة هيكل البيانات
  console.log('🔍 Events Data Structure:', eventsData);
  const latestEvents = (() => {
    try {
      // هيكل البيانات الفعلي من الخادم
      if (
        (eventsData as any)?.data?.items?.rows &&
        Array.isArray((eventsData as any).data.items.rows)
      ) {
        return (eventsData as any).data.items.rows;
      }
      if (eventsData?.data?.items && Array.isArray(eventsData.data.items)) {
        return eventsData.data.items;
      }
      if (
        (eventsData as any)?.items &&
        Array.isArray((eventsData as any).items)
      ) {
        return (eventsData as any).items;
      }
      if (Array.isArray(eventsData)) {
        return eventsData;
      }
      return [];
    } catch (error) {
      console.error('Error parsing events data:', error);
      return [];
    }
  })();

  // Fetch latest programs
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ['latest-programs'],
    queryFn: () => fetchPrograms({ page: 1, limit: 2 }),
    staleTime: 5 * 60 * 1000,
  });
  const latestPrograms = (() => {
    try {
      // هيكل البيانات الفعلي من الخادم
      if (
        (programsData as any)?.data?.items?.rows &&
        Array.isArray((programsData as any).data.items.rows)
      ) {
        return (programsData as any).data.items.rows;
      }
      if (programsData?.data?.items && Array.isArray(programsData.data.items)) {
        return programsData.data.items;
      }
      if (
        (programsData as any)?.items &&
        Array.isArray((programsData as any).items)
      ) {
        return (programsData as any).items;
      }
      if (Array.isArray(programsData)) {
        return programsData;
      }
      return [];
    } catch (error) {
      console.error('Error parsing programs data:', error);
      return [];
    }
  })();

  // Platform stats with real data
  const stats = [
    {
      number: 1240,
      label: t('home.stats.members'),
      icon: <Users className="w-8 h-8 text-primary-500" />,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      number: 87,
      label: t('home.stats.events'),
      icon: <Calendar className="w-8 h-8 text-accent-500" />,
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50',
    },
    {
      number: 18,
      label: t('home.stats.countries'),
      icon: <Globe className="w-8 h-8 text-secondary-500" />,
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      number: 12,
      label: t('home.stats.programs'),
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={t('home.seo.title', 'منصة شبابنا العالمية - الصفحة الرئيسية')}
        description={t(
          'home.seo.description',
          'منصة شبابية عالمية للفعاليات والبرامج والتطوع.'
        )}
        type="website"
      />

      {/* Hero Section - Enhanced */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
        aria-label={t('home.hero.aria', 'قسم البطل - مقدمة المنصة')}
      >
        {/* Enhanced Background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50"></div>

        {/* Animated geometric patterns */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-10">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-200 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              duration: 80,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-accent-200 to-transparent rounded-full blur-3xl"
          />
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-20 w-4 h-4 bg-primary-400 rounded-full opacity-60"
        />
        <motion.div
          animate={{
            y: [10, -10, 10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-40 right-32 w-3 h-3 bg-accent-400 rounded-full opacity-60"
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-5 py-14 px-4">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full border border-primary-200"
            >
              <Sparkles className="w-3 h-3 text-primary-600" />
              <span className="text-xs font-medium text-primary-700">
                {t('home.hero.badge', 'منصة عالمية')}
              </span>
            </motion.div>

            <h1
              className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-700 via-primary-800 to-accent-700 leading-tight drop-shadow-sm"
              tabIndex={0}
            >
              {t('home.hero.title', 'منصة شبابنا العالمية')}
            </h1>

            <p
              className="text-base md:text-lg text-primary-800 font-medium mb-3 max-w-3xl mx-auto leading-relaxed"
              tabIndex={0}
            >
              {t(
                'home.hero.subtitle',
                'نصنع الأثر معاً... حيث يلتقي الشباب المسلم في إسطنبول والعالم للإبداع والعمل التطوعي والتطوير.'
              )}
            </p>

            <p
              className="text-sm md:text-base text-neutral-700 mb-5 max-w-2xl mx-auto leading-relaxed"
              tabIndex={0}
            >
              {t(
                'home.hero.shortDesc',
                'منصة رقمية تجمع الشباب لصناعة التغيير الإيجابي عبر فعاليات وبرامج ملهمة.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                size="lg"
                variant="primary"
                className="px-7 py-3 text-base font-bold shadow-xl hover:shadow-primary-500/25 transition-all duration-300"
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

              <Button
                size="lg"
                variant="outline"
                className="px-7 py-3 text-base font-bold border-2 hover:bg-primary-50 transition-all duration-300"
                onClick={() => setShowModal(true)}
              >
                {t('home.hero.learnMore', 'اعرف المزيد')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Enhanced with animated counters */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 via-transparent to-accent-50/50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${stat.bgColor} mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent mb-1">
                  <CountUpNumber value={stat.number} />
                  <span className="text-lg">+</span>
                </div>
                <p className="text-sm font-medium text-neutral-700">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section - Enhanced */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-200/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2
              className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-accent-700 mb-4"
              tabIndex={0}
            >
              {t('home.features.title', 'ماذا نقدم؟')}
            </h2>
            <p className="text-base text-neutral-700 max-w-2xl mx-auto">
              {t(
                'home.features.subtitle',
                'نقدم مجموعة شاملة من الخدمات والبرامج المصممة خصيصاً لاحتياجات الشباب'
              )}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <Card
                variant="glass"
                className="h-full group hover:scale-105 transition-all duration-500"
                interactive
                glow
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-accent-100 to-primary-100 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-7 h-7 text-accent-600" />
                  </div>
                  <CardTitle className="text-lg font-bold text-primary-800 mb-2">
                    {t('home.features.events.title', 'الفعاليات وورش العمل')}
                  </CardTitle>
                  <CardSubtitle className="text-sm text-neutral-700">
                    {t(
                      'home.features.events.description',
                      'جلسات وورش تفاعلية لتطوير المهارات وبناء العلاقات.'
                    )}
                  </CardSubtitle>
                </CardHeader>
                <CardBody className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>ورش عمل تفاعلية</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Target className="w-4 h-4 text-green-500" />
                      <span>تطوير المهارات</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>بناء العلاقات</span>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button
                    variant="accent"
                    className="w-full group-hover:shadow-lg group-hover:shadow-accent-200"
                    onClick={() => navigate('/events')}
                  >
                    {t('home.features.learnMore', 'اعرف المزيد')}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                variant="glass"
                className="h-full group hover:scale-105 transition-all duration-500"
                interactive
                glow
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-7 h-7 text-primary-600" />
                  </div>
                  <CardTitle className="text-lg font-bold text-primary-800 mb-2">
                    {t('home.features.programs.title', 'برامج تطويرية')}
                  </CardTitle>
                  <CardSubtitle className="text-sm text-neutral-700">
                    {t(
                      'home.features.programs.description',
                      'برامج طويلة الأمد للقيادة والتطوير.'
                    )}
                  </CardSubtitle>
                </CardHeader>
                <CardBody className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Award className="w-4 h-4 text-purple-500" />
                      <span>برامج قيادية</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span>تطوير المهارات</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>نمو مستمر</span>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button
                    variant="primary"
                    className="w-full group-hover:shadow-lg group-hover:shadow-primary-200"
                    onClick={() => navigate('/programs')}
                  >
                    {t('home.features.learnMore', 'اعرف المزيد')}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                variant="glass"
                className="h-full group hover:scale-105 transition-all duration-500"
                interactive
                glow
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-primary-100 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <HeartHandshake className="w-7 h-7 text-green-600" />
                  </div>
                  <CardTitle className="text-lg font-bold text-primary-800 mb-2">
                    {t('home.features.community.title', 'مجتمع عالمي')}
                  </CardTitle>
                  <CardSubtitle className="text-sm text-neutral-700">
                    {t(
                      'home.features.community.description',
                      'تواصل مع شباب من أنحاء العالم واصنع صداقات دائمة.'
                    )}
                  </CardSubtitle>
                </CardHeader>
                <CardBody className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>شباب من 18 دولة</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <HeartHandshake className="w-4 h-4 text-red-500" />
                      <span>صداقات دائمة</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Users className="w-4 h-4 text-green-500" />
                      <span>مجتمع داعم</span>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button
                    variant="success"
                    className="w-full group-hover:shadow-lg group-hover:shadow-green-200"
                    onClick={() => navigate('/join-us')}
                  >
                    {t('home.features.learnMore', 'اعرف المزيد')}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Latest Events Section - Enhanced */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-br from-neutral-50 to-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2
              className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-accent-700 mb-4"
              tabIndex={0}
            >
              {t('home.latestEvents', 'آخر الفعاليات')}
            </h2>
            <p className="text-base text-neutral-700 max-w-2xl mx-auto">
              {t(
                'home.latestEvents.subtitle',
                'اكتشف أحدث الفعاليات والورش التي نقدمها'
              )}
            </p>
          </motion.div>

          {eventsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : latestEvents.length === 0 ? (
            <Alert type="info">
              {t('home.noEvents', 'لا توجد فعاليات حالياً')}
            </Alert>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {latestEvents.map((event: any, index: number) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <Card
                    variant="default"
                    className="h-full group hover:scale-105 transition-all duration-500"
                    interactive
                    glow
                  >
                    <CardHeader>
                      <CardTitle className="text-base font-bold text-primary-800 mb-2 group-hover:text-primary-700 transition-colors">
                        {event.title}
                      </CardTitle>
                      <CardSubtitle className="text-sm text-neutral-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {event.start_date}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Globe className="w-4 h-4" />
                          {event.location}
                        </div>
                      </CardSubtitle>
                    </CardHeader>
                    <CardBody className="flex-1">
                      <p className="text-neutral-700 line-clamp-3 mb-4">
                        {event.description}
                      </p>
                    </CardBody>
                    <CardFooter>
                      <Link
                        to={`/events/${event.id}`}
                        className="w-full"
                        tabIndex={0}
                        aria-label={t('home.viewDetails', 'عرض التفاصيل')}
                      >
                        <Button
                          variant="accent"
                          size="sm"
                          className="w-full group-hover:shadow-lg group-hover:shadow-accent-200"
                        >
                          {t('home.viewDetails', 'عرض التفاصيل')}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Latest Programs Section - Enhanced */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        id="programs"
        className="py-20 bg-gradient-to-br from-white to-primary-50/30"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2
              className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-accent-700 mb-4"
              tabIndex={0}
            >
              {t('home.latestPrograms', 'آخر البرامج')}
            </h2>
            <p className="text-base text-neutral-700 max-w-2xl mx-auto">
              {t(
                'home.latestPrograms.subtitle',
                'اكتشف برامجنا التطويرية المميزة'
              )}
            </p>
          </motion.div>

          {programsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : latestPrograms.length === 0 ? (
            <Alert type="info">
              {t('home.noPrograms', 'لا توجد برامج حالياً')}
            </Alert>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {latestPrograms.map((program: Program, index: number) => (
                <motion.div
                  key={program.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <Card
                    variant="default"
                    className="h-full group hover:scale-105 transition-all duration-500"
                    interactive
                    glow
                  >
                    <CardHeader>
                      <CardTitle className="text-base font-bold text-primary-800 mb-2 group-hover:text-primary-700 transition-colors">
                        {program.title}
                      </CardTitle>
                      <CardSubtitle className="text-sm text-neutral-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {program.category}
                        </div>
                      </CardSubtitle>
                    </CardHeader>
                    <CardBody className="flex-1">
                      <p className="text-neutral-700 line-clamp-3 mb-4">
                        {program.description}
                      </p>
                      {program.current_amount && program.goal_amount && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-neutral-600 mb-1">
                            <span>التقدم</span>
                            <span>
                              {Math.round(
                                (program.current_amount / program.goal_amount) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (program.current_amount /
                                    program.goal_amount) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </CardBody>
                    <CardFooter>
                      <Link
                        to={`/programs/${program.id}`}
                        className="w-full"
                        tabIndex={0}
                        aria-label={t('home.viewDetails', 'عرض التفاصيل')}
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full group-hover:shadow-lg group-hover:shadow-primary-200"
                        >
                          {t('home.viewDetails', 'عرض التفاصيل')}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Newsletter Section - Enhanced */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-br from-primary-50 via-accent-50 to-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-accent-200/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2
              className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-accent-700 mb-3"
              tabIndex={0}
            >
              {t('home.newsletter.title', 'اشترك في النشرة البريدية')}
            </h2>
            <p className="text-sm text-neutral-700">
              {t(
                'home.newsletter.subtitle',
                'احصل على آخر الأخبار والفعاليات مباشرة في بريدك الإلكتروني'
              )}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
              className="flex-1"
              aria-label={t(
                'home.newsletter.placeholder',
                'أدخل بريدك الإلكتروني'
              )}
            />
            <Button
              type="submit"
              size="md"
              variant="accent"
              disabled={newsletterStatus === 'loading'}
              aria-busy={newsletterStatus === 'loading'}
              className="w-full md:w-auto px-6 font-bold shadow-lg hover:shadow-accent-200 transition-all duration-300"
            >
              {newsletterStatus === 'loading'
                ? t('home.newsletter.loading', 'جاري الإرسال...')
                : t('home.newsletter.cta', 'اشترك')}
            </Button>
          </motion.form>

          <AnimatePresence>
            {newsletterStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <Alert
                  type={newsletterStatus === 'success' ? 'success' : 'error'}
                  className="text-center"
                  aria-live="polite"
                >
                  {newsletterMsg}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Enhanced Learn More Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={t('home.hero.learnMore', 'اعرف المزيد')}
        aria-label={t('home.hero.learnMore', 'اعرف المزيد')}
      >
        <div className="p-6 space-y-6">
          {/* Platform Overview */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t('home.modal.title', 'منصة شبابنا العالمية')}
            </h3>
            <p className="text-gray-600">
              {t(
                'home.modal.subtitle',
                'منصة رقمية تجمع الشباب من جميع أنحاء العالم لصناعة التغيير الإيجابي'
              )}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-primary-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {t('home.modal.features.events', 'فعاليات متنوعة')}
                </h4>
                <p className="text-sm text-gray-600">
                  {t(
                    'home.modal.features.eventsDesc',
                    'ورش عمل، مؤتمرات، وفرص شبكة تواصل'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-accent-50 rounded-lg">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {t('home.modal.features.programs', 'برامج تطويرية')}
                </h4>
                <p className="text-sm text-gray-600">
                  {t(
                    'home.modal.features.programsDesc',
                    'برامج تعليمية وتدريبية لتنمية المهارات'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-secondary-50 rounded-lg">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {t('home.modal.features.community', 'مجتمع عالمي')}
                </h4>
                <p className="text-sm text-gray-600">
                  {t(
                    'home.modal.features.communityDesc',
                    'انضم إلى شبكة من الشباب المتحمسين'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {t('home.modal.features.impact', 'تأثير إيجابي')}
                </h4>
                <p className="text-sm text-gray-600">
                  {t(
                    'home.modal.features.impactDesc',
                    'ساهم في صناعة التغيير في مجتمعك'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              {t('home.modal.cta', 'ابدأ رحلتك معنا اليوم')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => {
                  setShowModal(false);
                  navigate('/programs');
                }}
                className="px-6 py-2"
              >
                {t('home.modal.explorePrograms', 'استكشف البرامج')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  navigate('/events');
                }}
                className="px-6 py-2"
              >
                {t('home.modal.exploreEvents', 'استكشف الفعاليات')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Enhanced animated counter component
const CountUpNumber: React.FC<{ value: number; className?: string }> = ({
  value,
  className,
}) => {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(value / 60);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, duration / 60);
    return () => clearInterval(interval);
  }, [value]);

  return <span className={className}>{count.toLocaleString()}</span>;
};

export default Home;
