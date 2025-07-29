import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/common/SEO';
import { Card } from '../components/ui/Card/Card';
import { Button } from '../components/ui/Button/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProgressBar from '../components/common/ProgressBar';
import NewsletterSignup from '../components/common/NewsletterSignup';
import StatsCounter from '../components/common/StatsCounter';
import { fetchEvents } from '../services/eventsApi';
import { fetchPrograms } from '../services/programsApi';
import { testHomePageData } from '../test-data';
import {
  Users,
  Calendar,
  MapPin,
  ArrowRight,
  Target,
  TrendingUp,
  Award,
  Heart,
  Star,
  Clock,
  CheckCircle,
  Play,
  BookOpen,
  Globe,
  Shield,
  Zap,
  Lightbulb,
  Users2,
  Building2,
  GraduationCap,
  Briefcase,
  Smile,
  Sparkles,
  Rocket,
  Trophy,
  Gift,
  Eye,
  Sparkle,
} from 'lucide-react';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  // إضافة اختبار البيانات في وحدة التحكم
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '🔧 تم تحميل اختبار البيانات. استخدم testHomePageData() في وحدة التحكم'
      );
      window.testHomePageData = testHomePageData;
    }
  }, []);

  // Fetch real data from API
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = useQuery({
    queryKey: ['home-events'],
    queryFn: () => fetchEvents({ limit: 6, status: 'upcoming' }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: programsData,
    isLoading: programsLoading,
    error: programsError,
  } = useQuery({
    queryKey: ['home-programs'],
    queryFn: () => fetchPrograms({ limit: 6 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get real events data
  const featuredEvents = eventsData?.data?.items || [];
  const featuredPrograms = programsData?.data?.items || [];

  // Calculate real statistics from data
  const totalEvents = eventsData?.data?.pagination?.total || 0;
  const totalPrograms =
    programsData?.data?.total || programsData?.data?.items?.length || 0;
  const totalParticipants = featuredEvents.reduce(
    (sum: number, event: any) => sum + (event.attendees || 0),
    0
  );
  const totalProgramParticipants = featuredPrograms.reduce(
    (sum: number, program: any) => sum + (program.participants_count || 0),
    0
  );

  // إضافة console.log للتتبع
  useEffect(() => {
    console.log('📊 بيانات الصفحة الرئيسية:');
    console.log('   - الفعاليات:', featuredEvents.length);
    console.log('   - البرامج:', featuredPrograms.length);
    console.log('   - إجمالي الفعاليات:', totalEvents);
    console.log('   - إجمالي البرامج:', totalPrograms);
    console.log(
      '   - إجمالي المشاركين:',
      totalParticipants + totalProgramParticipants
    );
  }, [
    featuredEvents,
    featuredPrograms,
    totalEvents,
    totalPrograms,
    totalParticipants,
    totalProgramParticipants,
  ]);

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: `${totalParticipants + totalProgramParticipants}+`,
      label: 'شاب مشارك',
      color: 'bg-gradient-to-br from-primary-500 to-primary-600',
      delay: 0.1,
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      value: `${totalEvents}+`,
      label: 'فعالية منجزة',
      color: 'bg-gradient-to-br from-accent-500 to-accent-600',
      delay: 0.2,
    },
    {
      icon: <Target className="w-8 h-8" />,
      value: `${totalPrograms}+`,
      label: 'برنامج مستمر',
      color: 'bg-gradient-to-br from-secondary-500 to-secondary-600',
      delay: 0.3,
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: '95%',
      label: 'معدل الرضا',
      color: 'bg-gradient-to-br from-success-500 to-success-600',
      delay: 0.4,
    },
  ];

  const features = [
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: 'برامج تطويرية',
      description: 'برامج شاملة لتطوير المهارات الشخصية والمهنية',
      color: 'text-primary-600',
      bgColor: 'bg-gradient-to-br from-primary-50 to-primary-100',
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      icon: <Users2 className="w-12 h-12" />,
      title: 'مجتمع نشط',
      description: 'انضم إلى مجتمع من الشباب الطموحين والمبدعين',
      color: 'text-accent-600',
      bgColor: 'bg-gradient-to-br from-accent-50 to-accent-100',
      gradient: 'from-accent-500 to-accent-600',
    },
    {
      icon: <Building2 className="w-12 h-12" />,
      title: 'فعاليات متنوعة',
      description: 'ورش عمل ومؤتمرات وندوات في مختلف المجالات',
      color: 'text-secondary-600',
      bgColor: 'bg-gradient-to-br from-secondary-50 to-secondary-100',
      gradient: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'بيئة آمنة',
      description: 'بيئة داعمة وآمنة للتطوير والنمو',
      color: 'text-success-600',
      bgColor: 'bg-gradient-to-br from-success-50 to-success-100',
      gradient: 'from-success-500 to-success-600',
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: 'تواصل عالمي',
      description: 'فرص للتواصل مع شباب من مختلف أنحاء العالم',
      color: 'text-warning-600',
      bgColor: 'bg-gradient-to-br from-warning-50 to-warning-100',
      gradient: 'from-warning-500 to-warning-600',
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'تطوير سريع',
      description: 'برامج مكثفة لتحقيق النتائج بسرعة وفعالية',
      color: 'text-info-600',
      bgColor: 'bg-gradient-to-br from-info-50 to-info-100',
      gradient: 'from-info-500 to-info-600',
    },
  ];

  const testimonials = [
    {
      name: 'أحمد محمد',
      role: 'مطور برمجيات',
      content: 'منصة رائعة ساعدتني في تطوير مهاراتي التقنية والقيادية',
      avatar: '👨‍💻',
      rating: 5,
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      name: 'سارة أحمد',
      role: 'ريادية أعمال',
      content: 'البرامج المقدمة ممتازة وساعدتني في تطوير مشروعي',
      avatar: '👩‍💼',
      rating: 5,
      gradient: 'from-accent-500 to-accent-600',
    },
    {
      name: 'محمد علي',
      role: 'طالب جامعي',
      content: 'فعاليات مميزة وبيئة داعمة للتطوير والنمو',
      avatar: '👨‍🎓',
      rating: 5,
      gradient: 'from-secondary-500 to-secondary-600',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProgressPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  if (isLoading || eventsLoading || programsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <LoadingSpinner size="xl" text="جاري تحميل الموقع..." />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title="منصة شبابنا العالمية - الصفحة الرئيسية"
        description="منصة شاملة للشباب العرب تقدم البرامج والفعاليات والأنشطة المجتمعية"
        type="website"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-40 w-24 h-24 bg-accent-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-black/10"
        ></motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full mb-6 shadow-2xl">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent"
            >
              منصة شبابنا العالمية
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              منصة شاملة للشباب العرب تقدم البرامج والفعاليات والأنشطة المجتمعية
              <br />
              <span className="text-accent-200 font-semibold">
                نطور الشباب، نبني المستقبل
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                to="/events"
                className="group bg-gradient-to-r from-white to-accent-50 text-primary-600 hover:from-accent-50 hover:to-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl inline-flex items-center justify-center transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center justify-center">
                  استكشف الفعاليات
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/programs"
                className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
              >
                اكتشف البرامج
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent">
                  {totalEvents}+
                </div>
                <div className="text-white/70 text-sm">فعالية</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent">
                  {totalPrograms}+
                </div>
                <div className="text-white/70 text-sm">برنامج</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent">
                  {totalParticipants + totalProgramParticipants}+
                </div>
                <div className="text-white/70 text-sm">مشارك</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2327548A' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: stat.delay }}
                className="text-center group"
              >
                <div
                  className={`${stat.color} w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-2xl`}
                >
                  {stat.icon}
                </div>
                <StatsCounter
                  value={parseInt(stat.value.replace('+', ''))}
                  suffix="+"
                  className="text-4xl font-bold text-gray-900 mb-3"
                />
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20"
          ></motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-accent-200 to-accent-300 rounded-full opacity-20"
          ></motion.div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-xl"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              لماذا منصة شبابنا؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات والبرامج المصممة خصيصاً لتطوير الشباب
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="group"
              >
                <Card className="p-8 hover:shadow-2xl transition-all duration-300 h-full group-hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
                  <div
                    className={`${feature.bgColor} w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <div className={feature.color}>{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div
                    className={`mt-4 w-12 h-1 bg-gradient-to-r ${feature.gradient} rounded-full group-hover:w-16 transition-all duration-300`}
                  ></div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl mb-6 shadow-xl"
            >
              <Calendar className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">
              أحدث الفعاليات
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اكتشف أحدث الفعاليات والورش التي نقدمها
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.slice(0, 6).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="group"
              >
                <Card className="p-6 hover:shadow-2xl transition-all duration-300 h-full group-hover:scale-105 border-0 bg-gradient-to-br from-white to-neutral-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                          {event.category}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {event.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(event.start_date)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {event.attendees || 0} مشارك
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <ProgressBar
                        progress={getProgressPercentage(
                          event.attendees || 0,
                          event.max_attendees || 1
                        )}
                        label={`${event.attendees || 0}/${
                          event.max_attendees || 1
                        } مشارك`}
                        color="primary"
                        size="sm"
                      />

                      <Link
                        to={`/events/${event.id}`}
                        className="w-full mt-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center py-3 group-hover:shadow-lg transform group-hover:scale-105"
                      >
                        <span className="flex items-center justify-center">
                          عرض التفاصيل
                          <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-primary-600 border-2 border-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              عرض جميع الفعاليات
              <ArrowRight className="w-5 h-5 mr-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-accent-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl mb-6 shadow-xl"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-accent-600 to-secondary-600 bg-clip-text text-transparent">
              أحدث البرامج
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اكتشف برامجنا التطويرية المميزة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrograms.slice(0, 6).map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="group"
              >
                <Card className="p-6 hover:shadow-2xl transition-all duration-300 h-full group-hover:scale-105 border-0 bg-gradient-to-br from-white to-accent-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                          {program.category}
                        </span>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          {program.participants_count || 0} مشارك
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-accent-600 transition-colors">
                        {program.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {program.description}
                      </p>

                      <ProgressBar
                        progress={getProgressPercentage(
                          program.current_amount || 0,
                          program.goal_amount || 1
                        )}
                        label={`${(
                          program.current_amount || 0
                        ).toLocaleString()}/${(
                          program.goal_amount || 0
                        ).toLocaleString()} ريال`}
                        color="success"
                        size="sm"
                      />

                      <Link
                        to={`/programs/${program.id}`}
                        className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white border-accent-600 hover:border-accent-700 font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center px-4 py-2 text-sm mt-4 w-full transform group-hover:scale-105"
                      >
                        <span className="flex items-center justify-center">
                          تبرع الآن
                          <Heart className="w-4 h-4 mr-2" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center mt-12"
          >
            <Link
              to="/programs"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-accent-600 border-2 border-accent-600 rounded-xl hover:bg-accent-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              عرض جميع البرامج
              <ArrowRight className="w-5 h-5 mr-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl mb-6 shadow-xl"
            >
              <Smile className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-success-600 to-primary-600 bg-clip-text text-transparent">
              ماذا يقول المشاركون؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              استمع إلى تجارب الشباب الذين استفادوا من منصتنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="group"
              >
                <Card className="p-8 hover:shadow-2xl transition-all duration-300 h-full group-hover:scale-105 border-0 bg-gradient-to-br from-white to-neutral-50">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{testimonial.avatar}</div>
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div
                      className={`bg-gradient-to-r ${testimonial.gradient} text-white px-4 py-2 rounded-xl inline-block`}
                    >
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm opacity-90">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-accent-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white to-accent-50 rounded-2xl mb-6 shadow-2xl"
            >
              <Rocket className="w-12 h-12 text-primary-600" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent">
              انضم إلى مجتمعنا النشط
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              سجل الآن واستفد من جميع المميزات والخدمات التي نقدمها
              <br />
              <span className="text-accent-200 font-semibold">
                ابدأ رحلة التطوير معنا اليوم
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-white to-accent-50 text-primary-600 hover:from-accent-50 hover:to-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl inline-flex items-center justify-center transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center justify-center">
                  إنشاء حساب مجاني
                  <CheckCircle className="w-5 h-5 mr-2" />
                </span>
              </Link>
              <Link
                to="/login"
                className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
              >
                تسجيل الدخول
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
