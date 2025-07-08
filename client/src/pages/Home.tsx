import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
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
import { useQuery } from '@tanstack/react-query';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import SectionTitle from '../components/common/SectionTitle';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEvents } from '../services/eventsApi';
import { fetchPrograms } from '../services/programsApi';
import { Program } from '../types';
import {
  AccessibleSection,
  AccessibleCard,
  AccessibleButton,
  SkipToContent,
} from '../components/common/AccessibleComponents';

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
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      description: t('home.stats.membersDesc'),
    },
    {
      number: '50+',
      label: t('home.stats.events'),
      icon: CalendarDays,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      description: t('home.stats.eventsDesc'),
    },
    {
      number: '25+',
      label: t('home.stats.countries'),
      icon: MapPin,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      description: t('home.stats.countriesDesc'),
    },
    {
      number: '10+',
      label: t('home.stats.programs'),
      icon: BookOpen,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      description: t('home.stats.programsDesc'),
    },
  ];

  // Platform features
  const features = [
    {
      icon: Calendar,
      title: t('home.features.events.title'),
      description: t('home.features.events.description'),
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      link: '/events',
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      icon: Target,
      title: t('home.features.programs.title'),
      description: t('home.features.programs.description'),
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      link: '/programs',
      gradient: 'from-accent-500 to-accent-600',
    },
    {
      icon: Handshake,
      title: t('home.features.community.title'),
      description: t('home.features.community.description'),
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      link: '/join-us',
      gradient: 'from-secondary-500 to-secondary-600',
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <div className="min-h-screen">
      <SkipToContent />
      <SEO
        title={t('home.seo.title')}
        description={t('home.seo.description')}
        type="website"
      />

      {/* Hero Section */}
      <AccessibleSection variant="hero" ariaLabel="القسم الرئيسي">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Enhanced Floating Elements */}
        <motion.div
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-16 left-8 w-6 h-6 bg-white/25 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute top-32 right-16 w-8 h-8 bg-white/15 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [0, -25, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-16 left-16 w-4 h-4 bg-white/35 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/20 rounded-full"
        />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Enhanced Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/15 backdrop-blur-md rounded-full border border-white/25 mb-6 shadow-xl hover:bg-white/20 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                <span className="text-white text-sm font-semibold">
                  {t('home.hero.badge')}
                </span>
              </motion.div>

              {/* Enhanced Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center mb-6"
              >
                <div className="w-24 h-24 bg-white/15 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/25 hover:bg-white/20 transition-all duration-300 group">
                  <span className="text-white font-bold text-3xl group-hover:scale-110 transition-transform duration-300">
                    SG
                  </span>
                </div>
              </motion.div>

              {/* Enhanced Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight tracking-tight"
              >
                {t('home.hero.title')}
              </motion.h1>

              {/* Enhanced Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-xl sm:text-2xl text-white/95 mb-10 max-w-4xl mx-auto leading-relaxed font-medium"
              >
                {t('home.hero.subtitle')}
              </motion.p>

              {/* Enhanced CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Button
                  as={Link}
                  to="/join-us"
                  variant="primary"
                  size="lg"
                  className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 shadow-2xl min-w-[180px] font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 border-2 border-yellow-400"
                >
                  {t('home.hero.cta')}
                </Button>
                <Button
                  as={Link}
                  to="/programs"
                  variant="primary"
                  size="lg"
                  className="bg-transparent text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm font-bold shadow-xl min-w-[180px] text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:border-white/50"
                >
                  {t('home.hero.learn')}
                </Button>
              </motion.div>

              {/* Additional Stats Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-12 flex justify-center items-center gap-8 text-white/80 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Users2 className="w-4 h-4" />
                  <span>500+ {t('home.stats.members')}</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>50+ {t('home.stats.events')}</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>25+ {t('home.stats.countries')}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AccessibleSection>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group cursor-pointer"
              >
                <div className="text-center p-6 rounded-2xl bg-neutral-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-neutral-200">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${stat.bgColor} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm text-neutral-600 group-hover:text-neutral-800 transition-colors duration-300 font-medium">
                    {stat.label}
                  </div>
                  {stat.description && (
                    <div className="text-xs text-neutral-500 mt-2">
                      {stat.description}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <SectionTitle
              variant="centered"
              size="lg"
              className="text-neutral-900"
            >
              {t('home.features.title')}
            </SectionTitle>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto mt-6">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={feature.link}>
                  <Card
                    hover
                    variant="elevated"
                    className="h-full cursor-pointer group p-8"
                  >
                    <div
                      className={`w-16 h-16 mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-300">
                      {t('common.learnMore')}
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isRTL ? 'mr-1 rotate-180' : 'ml-1'
                        } group-hover:translate-x-1 transition-transform duration-300`}
                      />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Events & Programs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <SectionTitle
              variant="centered"
              size="lg"
              className="text-neutral-900"
            >
              {t('home.latest.title')}
            </SectionTitle>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto mt-6">
              {t('home.latest.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Latest Events */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                variant="accent"
                className="h-full p-8 bg-white border border-primary-100 shadow-lg rounded-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {t('home.latest.events')}
                  </h3>
                  <div className="w-12 h-12 bg-white border border-primary-100 rounded-xl flex items-center justify-center shadow-md">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                </div>

                {eventsLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" text={t('common.loading')} />
                  </div>
                ) : latestEvents.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {latestEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200 hover:border-primary-200 hover:-translate-y-1"
                      >
                        <h4 className="font-semibold text-neutral-900 mb-2">
                          {event.title}
                        </h4>
                        <div className="flex items-center text-sm text-neutral-600 space-x-4 rtl:space-x-reverse">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary-500" />
                            {new Date(event.start_date).toLocaleDateString()}
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-primary-500" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-600 mb-8">
                    {t('home.latest.noEvents')}
                  </p>
                )}

                <Link to="/events">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    fullWidth
                    className="mt-4"
                  >
                    {t('home.latest.viewAll')}
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Latest Programs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                variant="accent"
                className="h-full p-8 bg-white border border-primary-100 shadow-lg rounded-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {t('home.latest.programs')}
                  </h3>
                  <div className="w-12 h-12 bg-white border border-primary-100 rounded-xl flex items-center justify-center shadow-md">
                    <Target className="w-6 h-6 text-accent-600" />
                  </div>
                </div>

                {programsLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" text={t('common.loading')} />
                  </div>
                ) : latestPrograms.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {latestPrograms.map((program: Program) => (
                      <div
                        key={program.id}
                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200 hover:border-accent-200 hover:-translate-y-1"
                      >
                        <h4 className="font-semibold text-neutral-900 mb-2">
                          {program.title}
                        </h4>
                        <div className="flex items-center text-sm text-neutral-600 space-x-4 rtl:space-x-reverse">
                          {program.category && (
                            <span className="inline-flex items-center">
                              <Star className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-accent-500" />
                              {program.category}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-600 mb-8">
                    {t('home.latest.noPrograms')}
                  </p>
                )}

                <Link to="/programs">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    fullWidth
                    className="mt-4"
                  >
                    {t('home.latest.viewAll')}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl bg-white/95 rounded-2xl shadow-2xl px-8 py-12 flex flex-col items-center gap-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/40 mb-2 shadow-md">
                <Mail className="w-4 h-4 text-primary-700" />
                <span className="text-primary-800 text-sm font-bold">
                  {t('home.newsletter.badge')}
                </span>
              </div>
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-900 mb-2 text-center">
                {t('home.newsletter.title')}
              </h2>
              {/* Subtitle */}
              <p className="text-lg text-primary-700 mb-6 leading-relaxed text-center">
                {t('home.newsletter.subtitle')}
              </p>
              {/* Form */}
              <form
                onSubmit={handleNewsletter}
                className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
              >
                <input
                  type="email"
                  placeholder={t('home.newsletter.placeholder')}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-5 py-3 rounded-xl border-2 border-primary-300 shadow-lg bg-white text-primary-900 placeholder:text-primary-400 focus:border-primary-700 focus:ring-2 focus:ring-primary-200 outline-none text-lg font-medium transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-primary-800 text-white font-bold text-lg shadow-xl hover:bg-primary-900 transition-all min-w-[140px] whitespace-nowrap"
                  disabled={newsletterStatus === 'loading'}
                >
                  {newsletterStatus === 'loading'
                    ? t('common.loading')
                    : t('home.newsletter.subscribe')}
                </button>
              </form>
              {/* Status Messages */}
              {newsletterStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 w-full"
                >
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-800 rounded-lg px-4 py-3 font-bold text-center shadow">
                    {newsletterMsg}
                  </div>
                </motion.div>
              )}
              {newsletterStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 w-full"
                >
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-800 rounded-lg px-4 py-3 font-bold text-center shadow">
                    {newsletterMsg}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
