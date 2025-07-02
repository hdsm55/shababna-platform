import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

  // Features for the platform
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
      icon: Globe,
      title: t('home.features.community.title'),
      description: t('home.features.community.description'),
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      link: '/join-us',
      gradient: 'from-secondary-500 to-secondary-600',
    },
  ];

  // Platform stats
  const stats = [
    {
      number: '500+',
      label: t('home.stats.members'),
      icon: Users,
      link: '/join-us',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      number: '50+',
      label: t('home.stats.events'),
      icon: Calendar,
      link: '/events',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
    },
    {
      number: '25+',
      label: t('home.stats.countries'),
      icon: Globe,
      link: '/join-us',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      number: '10+',
      label: t('home.stats.programs'),
      icon: Zap,
      link: '/programs',
      color: 'text-success-600',
      bgColor: 'bg-success-50',
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
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-24 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern"></div>

        <div className="relative container">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  {t('home.hero.badge')}
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight text-shadow-lg">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/join-us">
                  <Button
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    variant="secondary"
                    className="bg-white text-primary-600 hover:bg-white/90 shadow-lg hover:shadow-xl min-w-[160px]"
                  >
                    {t('home.hero.cta')}
                  </Button>
                </Link>
                <Link to="/programs">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-primary-600 shadow-lg hover:shadow-xl min-w-[160px]"
                  >
                    {t('home.hero.learn')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute top-40 right-20 w-6 h-6 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-20 w-3 h-3 bg-white/30 rounded-full"
        />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="stats-card"
                onClick={() => (window.location.href = stat.link)}
              >
                <div className={`stats-icon ${stat.bgColor}`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-neutral-600 group-hover:text-neutral-800 transition-colors duration-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="text-center mb-16">
            <SectionTitle
              variant="centered"
              size="lg"
              className="text-neutral-900"
            >
              {t('home.features.title')}
            </SectionTitle>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={feature.link}>
                  <Card
                    hover
                    variant="elevated"
                    className="h-full cursor-pointer group bg-white border-neutral-200"
                  >
                    <div
                      className={`feature-icon bg-gradient-to-br ${feature.gradient} shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-6 flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-300">
                      {t('common.learnMore')}
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Events & Programs Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <SectionTitle
              variant="centered"
              size="lg"
              className="text-neutral-900"
            >
              {t('home.latest.title')}
            </SectionTitle>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('home.latest.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Latest Events */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 h-full border-primary-200">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {t('home.latest.events')}
                  </h3>
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                {eventsLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" text="Loading events..." />
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
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-accent-50 to-accent-100/50 h-full border-accent-200">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {t('home.latest.programs')}
                  </h3>
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-accent-600" />
                  </div>
                </div>
                {programsLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" text="Loading programs..." />
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
                    variant="secondary"
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
      <section className="section bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative container">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 shadow-lg">
                <Mail className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  {t('home.newsletter.badge')}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('home.newsletter.title')}
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                {t('home.newsletter.subtitle')}
              </p>
              <form
                onSubmit={handleNewsletter}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                {isRTL ? (
                  <>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="lg"
                      loading={newsletterStatus === 'loading'}
                      className="bg-white text-primary-600 hover:bg-white/90 shadow-lg hover:shadow-xl min-w-[140px] whitespace-nowrap order-2 sm:order-2"
                    >
                      {t('home.newsletter.subscribe')}
                    </Button>
                    <div className="flex-1 order-1 sm:order-1">
                      <Input
                        type="email"
                        placeholder={t('home.newsletter.placeholder')}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="w-full"
                        size="lg"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 order-1 sm:order-1">
                      <Input
                        type="email"
                        placeholder={t('home.newsletter.placeholder')}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="w-full"
                        size="lg"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="lg"
                      loading={newsletterStatus === 'loading'}
                      className="bg-white text-primary-600 hover:bg-white/90 shadow-lg hover:shadow-xl min-w-[140px] whitespace-nowrap order-2 sm:order-2"
                    >
                      {t('home.newsletter.subscribe')}
                    </Button>
                  </>
                )}
              </form>
              {newsletterStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Alert type="success" message={newsletterMsg} />
                </motion.div>
              )}
              {newsletterStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Alert type="error" message={newsletterMsg} />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
