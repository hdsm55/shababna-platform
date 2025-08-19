import React, { useState, useEffect, memo, useCallback, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Users2,
  ArrowRight,
} from 'lucide-react';
import {
  cacheConfig,
  queryOptimizations,
  progressiveLoading,
} from '../utils/performanceOptimizations';

import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/InputSimple';
import { Alert } from '../components/common/AlertSimple';
import { fetchEvents } from '../services/eventsApi';
import { fetchPrograms } from '../services/programsApi';
import { subscribeToNewsletter } from '../services/newsletterApi';
import { Program } from '../types';

// تحسين الاستيراد - استخدام lazy loading للمكونات الثقيلة
const HeroSection = React.lazy(() => import('../components/home/HeroSection'));
const StatsSection = React.lazy(
  () => import('../components/home/StatsSection')
);
const FeaturesSection = React.lazy(
  () => import('../components/home/FeaturesSection')
);

// تحسين الأداء - مكونات منفصلة مع تحسينات
const TestimonialsSection = memo(() => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'أحمد محمد',
      role: 'طالب جامعي',
      content:
        'منصة شبابنا ساعدتني في تطوير مهاراتي القيادية والتواصل مع شباب من مختلف الدول الإسلامية',
    },
    {
      name: 'فاطمة علي',
      role: 'مهندسة',
      content:
        'البرامج التطويرية ممتازة وساعدتني في بناء شبكة علاقات قوية مع شباب مسلمين طموحين',
    },
    {
      name: 'محمد حسن',
      role: 'طبيب',
      content:
        'الفعاليات التفاعلية كانت تجربة رائعة ساعدتني في تطوير شخصيتي ومهاراتي القيادية',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-dark-500 via-primary-900 to-secondary-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-500/30" />
      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            تجارب شبابنا
          </h2>
          <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            قصص نجاح وتجارب ملهمة من شبابنا في مختلف الدول
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex justify-center mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-accent-400 fill-current"
                    />
                  ))}
                </div>
              </div>
              <blockquote className="text-lg md:text-xl text-white mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-white mb-1">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-primary-200 text-sm">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentTestimonial
                  ? 'bg-white'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';

const LatestEventsSection = memo(() => {
  const navigate = useNavigate();

  // تحسين الاستعلام - تقليل البيانات المطلوبة وتحسين التخزين المؤقت
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['latest-events'],
    queryFn: () => fetchEvents({ page: 1, limit: 3 }),
    ...queryOptimizations,
    ...cacheConfig.events,
  });

  const latestEvents = eventsData?.data?.events || [];

  // تحسين حالة التحميل
  if (eventsLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="animate-pulse bg-dark-200 h-8 w-48 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-dark-200 h-4 w-96 mx-auto rounded"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-dark-200 h-40 rounded-lg mb-4"></div>
                <div className="bg-dark-200 h-4 w-3/4 mb-2 rounded"></div>
                <div className="bg-dark-200 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-500 mb-6">
            شبابنا
          </h2>
          <p className="text-lg md:text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed">
            الفعاليات
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="h-40 bg-gradient-to-br from-primary-700 via-primary-800 to-secondary-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-dark-500/20" />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                    {event.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-2 text-white text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{event.start_date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-dark-500 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-xs text-dark-600">
                    <Clock className="w-3 h-3" />
                    <span>{event.start_date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-dark-600">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full py-2 text-xs font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <span className="flex items-center justify-center gap-2">
                    عرض التفاصيل
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center mt-8"
        >
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/events')}
            className="px-6 py-3 text-sm font-semibold border-2 border-dark-300 hover:bg-dark-50 text-dark-700"
          >
            عرض جميع الفعاليات
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

LatestEventsSection.displayName = 'LatestEventsSection';

const LatestProgramsSection = memo(() => {
  const navigate = useNavigate();

  // تحسين الاستعلام - تقليل البيانات المطلوبة
  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ['latest-programs'],
    queryFn: () => fetchPrograms({ page: 1, limit: 3 }),
    ...queryOptimizations,
    ...cacheConfig.programs,
  });

  const latestPrograms = programsData?.data?.events || [];

  // تحسين حالة التحميل
  if (programsLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="animate-pulse bg-dark-200 h-8 w-48 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-dark-200 h-4 w-96 mx-auto rounded"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-dark-200 h-40 rounded-lg mb-4"></div>
                <div className="bg-dark-200 h-4 w-3/4 mb-2 rounded"></div>
                <div className="bg-dark-200 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark-500 mb-6">
            أحدث البرامج
          </h2>
          <p className="text-lg md:text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed">
            اكتشف برامجنا التطويرية المميزة المصممة لبناء قادة المستقبل
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPrograms.slice(0, 3).map((program) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="h-40 bg-gradient-to-br from-secondary-700 via-secondary-800 to-dark-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-dark-500/20" />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                    {program.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-dark-500 mb-2 line-clamp-2">
                  {program.title}
                </h3>
                <p className="text-dark-600 mb-3 line-clamp-3 leading-relaxed text-sm">
                  {program.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-dark-500">
                    {program.participants_count || 0} مشارك
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      program.status === 'active'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-dark-100 text-dark-700'
                    }`}
                  >
                    {program.status === 'active' ? 'متاح' : 'مغلق'}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full py-2 text-xs font-semibold bg-gradient-to-r from-secondary-700 to-secondary-800 hover:from-secondary-800 hover:to-dark-800"
                  onClick={() => navigate(`/programs/${program.id}`)}
                >
                  <span className="flex items-center justify-center gap-2">
                    عرض التفاصيل
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center mt-8"
        >
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/programs')}
            className="px-6 py-3 text-sm font-semibold border-2 border-dark-300 hover:bg-dark-50 text-dark-700"
          >
            عرض جميع البرامج
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

LatestProgramsSection.displayName = 'LatestProgramsSection';

const NewsletterSection = memo(() => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const handleNewsletterSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setNewsletterStatus('loading');
      setNewsletterMsg('');

      try {
        const result = await subscribeToNewsletter({ email: newsletterEmail });
        setNewsletterStatus('success');
        setNewsletterMsg(
          result.message || 'تم الاشتراك في النشرة البريدية بنجاح!'
        );
        setNewsletterEmail('');
      } catch (error: any) {
        setNewsletterStatus('error');
        setNewsletterMsg(
          error.response?.data?.message ||
            'حدث خطأ أثناء الاشتراك في النشرة البريدية'
        );
      }
      setTimeout(() => setNewsletterStatus('idle'), 4000);
    },
    [newsletterEmail]
  );

  return (
    <section className="py-20 bg-gradient-to-br from-dark-500 via-primary-900 to-secondary-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 via-secondary-600/20 to-primary-600/20" />
        <div className="absolute top-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary-400/5 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.3 }}
        className="relative max-w-4xl mx-auto px-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          ابق على اطلاع
        </h2>
        <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed mb-8">
          اشترك في نشرتنا البريدية لتصلك آخر الأخبار والفعاليات والبرامج الجديدة
        </p>

        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="flex-1 py-2 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={newsletterStatus === 'loading'}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 py-2 px-4 text-sm font-semibold shadow-lg"
            >
              {newsletterStatus === 'loading' ? 'جاري...' : 'اشتراك'}
            </Button>
          </div>
        </form>

        {newsletterStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Alert
              type={newsletterStatus === 'success' ? 'success' : 'error'}
              message={newsletterMsg}
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
});

NewsletterSection.displayName = 'NewsletterSection';

// مكون التحميل المحسن
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-dark-600">جاري التحميل...</p>
    </div>
  </div>
);

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.dir() === 'rtl';

  // تحسين التمرير - استخدام useCallback
  const scrollToPrograms = useCallback(() => {
    if (location.state?.scrollToPrograms) {
      const programsSection = document.getElementById('programs');
      if (programsSection) {
        programsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

  // تحسين useEffect
  useEffect(() => {
    scrollToPrograms();
  }, [scrollToPrograms]);

  return (
    <>
      <SEO
        title={t('home.meta.title')}
        description={t('home.meta.description')}
        keywords={t('home.meta.keywords')}
        image="/images/hero-bg.jpg"
      />

      <main className="min-h-screen">
        {/* Hero Section */}
        <Suspense fallback={<LoadingFallback />}>
          <HeroSection />
        </Suspense>

        {/* Stats Section */}
        <Suspense
          fallback={
            <div className="py-16 bg-gradient-to-br from-neutral-50 to-white">
              <div className="max-w-6xl mx-auto px-6">
                <div className="animate-pulse bg-dark-200 h-8 w-48 mx-auto mb-4 rounded"></div>
              </div>
            </div>
          }
        >
          <StatsSection />
        </Suspense>

        {/* Features Section */}
        <Suspense
          fallback={
            <div className="py-16 bg-white">
              <div className="max-w-6xl mx-auto px-6">
                <div className="animate-pulse bg-dark-200 h-8 w-48 mx-auto mb-4 rounded"></div>
              </div>
            </div>
          }
        >
          <FeaturesSection />
        </Suspense>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Latest Events Section */}
        <LatestEventsSection />

        {/* Latest Programs Section */}
        <section
          id="programs"
          className="py-16 bg-gradient-to-br from-neutral-50 to-primary-50"
        >
          <LatestProgramsSection />
        </section>

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>
    </>
  );
};

export default memo(Home);
