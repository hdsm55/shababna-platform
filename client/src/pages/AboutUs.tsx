/* eslint-disable */
// cspell:disable-file
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Target,
  Heart,
  Award,
  Globe,
  Lightbulb,
  Shield,
  Star,
  ArrowRight,
  Quote,
  Sparkles,
  Zap,
  TrendingUp,
  Users2,
} from 'lucide-react';

import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../services/eventsApi';
import { fetchBlogs } from '../services/blogsApi';
import { Link } from 'react-router-dom';
import { useSiteStats } from '../hooks/useSiteStats';

// قسم من نحن - تصميم مبسط
const AboutUsSection = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.section
      id="about-us"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="container mx-auto px-4">
        {/* العنوان الرئيسي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dark-500 mb-4">
            من نحن
          </h2>
          <p className="text-xl text-primary-600 font-medium">
            منظمة شبابنا العالمية
          </p>
        </motion.div>

        {/* المحتوى الرئيسي */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200"
          >
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-dark-500 text-center">
                منظمة شبابنا العالمية هي منصة شبابية عالمية مستقلة، تُعنى ببناء
                جيل شبابي فاعل ومؤثر، يحمل همّ أمّته، ويتسلّح بالعلم والوعي
                والقيم، ويشارك بفعالية في نهضة مجتمعه وأمّته.
              </p>

              <p className="text-lg leading-relaxed text-dark-500 text-center">
                ننطلق من رؤية شمولية تعزز التواصل بين الشباب حول العالم، وننفّذ
                برامج نوعية في مجالات التربية، والإعلام، والتنمية، والهوية،
                والقضايا الإسلامية، ضمن منظومة قيادية وكوادر مؤمنة برسالة
                التغيير الإيجابي.
              </p>
            </div>
          </motion.div>

          {/* النقاط الرئيسية */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-dark-500 mb-2">
                عالمية
              </h3>
              <p className="text-dark-400">نشاطنا يمتد عبر القارات</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-dark-500 mb-2">
                مستقلة
              </h3>
              <p className="text-dark-400">نعمل بحرية وشفافية</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-dark-500 mb-2">
                متخصصة
              </h3>
              <p className="text-dark-400">برامج نوعية ومؤثرة</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

// تحسين الأداء - مكونات منفصلة
const HeroSection = memo(() => {
  const { t } = useTranslation();
  const { data, loading, countriesCount } = useSiteStats();
  const format = (n: number) => new Intl.NumberFormat('ar-SA').format(n);

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        <motion.div
          variants={floatingVariants}
          animate="float"
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 2 }}
          className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 4 }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <motion.img
              src="/images/logo.svg"
              alt="شبابنا العالمية"
              className="h-20 w-20 object-contain mx-auto mb-6 logo"
              style={{ backgroundColor: 'transparent' }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-yellow-600" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {t('about.title', 'من نحن')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-lg md:text-xl text-neutral-100 leading-relaxed mb-6">
              {t(
                'about.subtitle',
                'منصة شبابنا العالمية - من قلب إسطنبول، نعمل معاً لبناء مستقبل الشباب المسلم في العالم'
              )}
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">
                  {loading || !data ? '…' : `${format(data.users)} شاب`}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Globe className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">{`${format(
                  countriesCount
                )} دولة`}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">
                  {loading || !data ? '…' : `${format(data.programs)} برنامج`}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

const PresidentMessage = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.section
      id="president"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dark-500 mb-4">
            كلمة الرئيس
          </h2>
        </motion.div>

        {/* المحتوى */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* صورة الرئيس */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="text-center">
                <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-white mb-6">
                  <img
                    src="/images/team/رئيس المنظمة.jpg"
                    alt="رئيس المنظمة"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/fallback.svg';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-dark-500 mb-1">
                  {t('about.president.name')}
                </h3>
                <p className="text-primary-600 font-medium">
                  {t('about.president.position')}
                </p>
              </div>
            </motion.div>

            {/* النص */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                <div className="space-y-6 text-dark-500 leading-relaxed">
                  <p>{t('about.president.greeting')}</p>
                  <p>{t('about.president.welcome')}</p>
                  <p>{t('about.president.vision')}</p>
                  <p>{t('about.president.mission')}</p>
                  <p>{t('about.president.commitment')}</p>
                  <p>{t('about.president.invitation')}</p>
                </div>

                {/* التوقيع */}
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary-700 mb-2">
                      {t('about.president.signature')}
                    </p>
                    <p className="text-xl font-bold text-primary-600 mb-1">
                      {t('about.president.signatureName')}
                    </p>
                    <p className="text-primary-500">
                      {t('about.president.signaturePosition')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

// قسم المدير التنفيذي - تصميم مبسط
const ExecutiveDirectorSection = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.section
      id="ceo"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dark-500 mb-4">
            كلمة المدير التنفيذي
          </h2>
        </motion.div>

        {/* المحتوى */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* النص */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
                <div className="space-y-6 text-dark-500 leading-relaxed whitespace-pre-line">
                  {t('about.ceo.message')}
                </div>

                {/* التوقيع */}
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-accent-700 mb-2">
                      {t('about.ceo.signature')}
                    </p>
                    <p className="text-xl font-bold text-accent-600 mb-1">
                      {t('about.ceo.signatureName')}
                    </p>
                    <p className="text-accent-500">
                      {t('about.ceo.signaturePosition')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* صورة المدير */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="text-center">
                <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-white mb-6">
                  <img
                    src="/images/team/المدير التنفيذي.jpeg"
                    alt="المدير التنفيذي"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/fallback.svg';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-dark-500 mb-1">
                  {t('about.ceo.name')}
                </h3>
                <p className="text-accent-600 font-medium">
                  {t('about.ceo.position')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

const VisionMission = memo(() => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      id="vision"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-dark-500 mb-4"
        >
          رؤيتنا ورسالتنا
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-dark-400 max-w-2xl mx-auto text-lg"
        >
          نسعى لبناء مستقبل أفضل للشباب المسلم من خلال رؤية واضحة ورسالة ملهمة
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* رؤيتنا */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="group"
        >
          <Card className="h-full p-8 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-200 rounded-full -translate-y-10 translate-x-10 opacity-30"></div>

            <div className="text-center mb-6 relative z-10">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Target className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-dark-500 mb-3">رؤيتنا</h3>
            </div>
            <p className="text-dark-400 text-center leading-relaxed relative z-10 text-base">
              نسعى لأن نكون المنصة الرائدة عالمياً في تطوير وتمكين الشباب
              المسلم، وإعدادهم ليكونوا قادة الغد المؤثرين في مجتمعاتهم والعالم.
            </p>
          </Card>
        </motion.div>

        {/* رسالتنا */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="group"
        >
          <Card className="h-full p-8 bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200 shadow-brand-lg hover:shadow-brand-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-secondary-200 rounded-full -translate-y-10 -translate-x-10 opacity-30"></div>

            <div className="text-center mb-6 relative z-10">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Globe className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-dark-500 mb-3">رسالتنا</h3>
            </div>
            <p className="text-dark-400 text-center leading-relaxed relative z-10 text-base">
              تمكين الشباب المسلم من خلال البرامج التطويرية والفعاليات الملهمة،
              وبناء جيل واعٍ قادر على صناعة التغيير الإيجابي في المجتمع.
            </p>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
});

const CoreValues = memo(() => {
  const values = [
    {
      icon: Star,
      title: 'التميز',
      description: 'نسعى للتميز في كل ما نقدمه من برامج وخدمات',
      color: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      iconColor: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Lightbulb,
      title: 'الابتكار',
      description: 'نبتكر حلولاً إبداعية لتحديات الشباب المعاصرة',
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      iconColor: 'from-blue-500 to-blue-600',
    },
    {
      icon: Heart,
      title: 'المجتمع',
      description: 'نؤمن بقوة المجتمع وأهمية العمل الجماعي',
      color: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      iconColor: 'from-red-500 to-red-600',
    },
    {
      icon: Shield,
      title: 'القيادة',
      description: 'نعد قادة المستقبل المؤثرين في مجتمعاتهم',
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      iconColor: 'from-green-500 to-green-600',
    },
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      id="values"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-dark-500 mb-4"
        >
          قيمنا الأساسية
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-dark-400 max-w-2xl mx-auto"
        >
          القيم التي نؤمن بها ونسعى لتحقيقها في كل برنامج وفعالية
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {values.map((value) => (
          <motion.div
            key={value.title}
            variants={itemVariants}
            className="group"
          >
            <Card
              className={`h-full p-6 bg-gradient-to-br ${value.color} border ${value.borderColor} shadow-brand-sm hover:shadow-brand-lg transition-all duration-300 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-8 translate-x-8"></div>

              <div className="text-center relative z-10">
                <motion.div
                  className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${value.iconColor} rounded-xl flex items-center justify-center shadow-md`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <value.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-dark-500 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-dark-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
});

const Achievements = memo(() => {
  const { data, loading, countriesCount, anyZero } = useSiteStats();

  const format = (n: number) => new Intl.NumberFormat('ar-SA').format(n);

  const achievements = [
    {
      icon: Users,
      number: loading || !data ? '…' : format(data.users),
      label: 'أعضاء',
      description:
        data && data.users === 0 ? 'لا يوجد أعضاء حالياً' : 'مجتمعنا يكبر',
      color: 'from-blue-500 to-blue-600',
      isZero: data ? data.users === 0 : false,
    },
    {
      icon: Globe,
      number: format(countriesCount),
      label: 'دول',
      description: 'قائمة ثابتة للدول العربية والإسلامية',
      color: 'from-green-500 to-green-600',
      isZero: false,
    },
    {
      icon: Award,
      number: loading || !data ? '…' : format(data.programs),
      label: 'برامج',
      description:
        data && data.programs === 0
          ? 'لا توجد برامج حالياً'
          : 'برامج نوعية ومؤثرة',
      color: 'from-purple-500 to-purple-600',
      isZero: data ? data.programs === 0 : false,
    },
    {
      icon: TrendingUp,
      number: loading || !data ? '…' : format(data.events),
      label: 'فعاليات',
      description:
        data && data.events === 0 ? 'لا توجد فعاليات حالياً' : 'فعاليات مستمرة',
      color: 'from-orange-500 to-orange-600',
      isZero: data ? data.events === 0 : false,
    },
  ];

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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.section
      id="achievements"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-dark-500 mb-4"
        >
          {anyZero ? 'أهدافنا' : 'أرقامنا'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-dark-400 max-w-2xl mx-auto"
        >
          المصدر: بيانات مباشرة من قاعدة البيانات + قائمة ثابتة للدول
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.label}
            variants={itemVariants}
            className="group"
          >
            <Card className="h-full p-6 bg-white border border-neutral-200 shadow-brand-sm hover:shadow-brand-lg transition-all duration-300 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

              <motion.div
                className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <achievement.icon className="w-8 h-8 text-white" />
              </motion.div>

              <motion.h3
                className="text-3xl font-bold text-dark-500 mb-1"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {achievement.number}
              </motion.h3>
              <p className="text-lg font-semibold text-primary-600 mb-1">
                {achievement.label}
              </p>
              <p className="text-sm text-dark-400">{achievement.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
});

// أحدث الفعاليات - محسن
const AboutLatestEvents = memo(() => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['about-latest-events'],
    queryFn: () => fetchEvents({ page: 1, limit: 6 }),
    staleTime: 10 * 60 * 1000,
  });

  const events = data?.data?.events || [];

  return (
    <motion.section
      id="latest-events"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="container mx-auto px-4">
        {/* العنوان الرئيسي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dark-500 mb-4">
            الفعاليات والأنشطة
          </h2>
          <p className="text-xl text-primary-600 font-medium mb-2">
            فعاليات ملهمة تواكب تطلعات الشباب
          </p>
          <p className="text-dark-400 max-w-2xl mx-auto">
            ننظم فعاليات متنوعة تهدف إلى تطوير مهارات الشباب وبناء شخصياتهم
            القيادية
          </p>
        </motion.div>

        {/* إحصائيات سريعة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="text-center p-6 bg-white rounded-2xl shadow-brand-sm border border-neutral-200">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-500 mb-1">
              {isLoading ? '...' : events.length}
            </h3>
            <p className="text-primary-600 font-medium">فعاليات نشطة</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-brand-sm border border-neutral-200">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-500 mb-1">مفتوحة</h3>
            <p className="text-secondary-600 font-medium">للجميع</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-brand-sm border border-neutral-200">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-500 mb-1">عالمية</h3>
            <p className="text-accent-600 font-medium">التغطية</p>
          </div>
        </motion.div>

        {/* قائمة الفعاليات */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(isLoading ? [1, 2, 3, 4, 5, 6] : events).map(
            (evt: any, i: number) => (
              <motion.div
                key={evt?.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full p-6 bg-white border border-neutral-200 shadow-brand-sm hover:shadow-brand-lg transition-all duration-300 relative overflow-hidden">
                  {/* شريط علوي ملون */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-neutral-200 rounded mb-3"></div>
                      <div className="h-3 bg-neutral-200 w-3/4 mb-2 rounded"></div>
                      <div className="h-3 bg-neutral-200 w-1/2 mb-4 rounded"></div>
                      <div className="h-8 bg-neutral-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      {/* أيقونة الفعالية */}
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>

                      {/* عنوان الفعالية */}
                      <h3 className="text-lg font-bold text-dark-500 mb-3 line-clamp-2">
                        {evt.title}
                      </h3>

                      {/* وصف الفعالية */}
                      <p className="text-sm text-dark-400 line-clamp-3 mb-4 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* تفاصيل إضافية */}
                      <div className="space-y-2 mb-4">
                        {evt.location && (
                          <div className="flex items-center text-xs text-dark-400">
                            <Globe className="w-4 h-4 ml-2" />
                            <span>{evt.location}</span>
                          </div>
                        )}
                        {evt.event_date && (
                          <div className="flex items-center text-xs text-dark-400">
                            <Star className="w-4 h-4 ml-2" />
                            <span>
                              {new Date(evt.event_date).toLocaleDateString(
                                'ar-SA'
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* رابط التفاصيل */}
                      <Link
                        to={`/events/${evt.id}`}
                        className="inline-flex items-center text-primary-600 text-sm font-semibold hover:text-primary-700 transition-colors duration-300"
                      >
                        تفاصيل الفعالية
                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </>
                  )}
                </Card>
              </motion.div>
            )
          )}
        </motion.div>

        {/* زر عرض المزيد */}
        {!isLoading && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              to="/events"
              className="inline-flex items-center justify-center font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              عرض جميع الفعاليات
              <ArrowRight className="w-5 h-5 mr-2" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
});

// أحدث المقالات - محسن
const AboutLatestBlogs = memo(() => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['about-latest-blogs'],
    queryFn: () => fetchBlogs({}),
    staleTime: 10 * 60 * 1000,
  });

  const blogs = data || [];

  return (
    <motion.section
      id="latest-blogs"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="container mx-auto px-4">
        {/* العنوان الرئيسي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-dark-500 mb-4">
            المقالات والمدونة
          </h2>
          <p className="text-xl text-secondary-600 font-medium mb-2">
            محتوى إثرائي يثري فكر الشباب
          </p>
          <p className="text-dark-400 max-w-2xl mx-auto">
            مقالات متنوعة تغطي قضايا الشباب المعاصرة وتقدم رؤى ملهمة للتطوير
            والتميز
          </p>
        </motion.div>

        {/* إحصائيات سريعة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="text-center p-6 bg-white rounded-2xl shadow-brand-sm border border-neutral-200">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-500 mb-1">
              {isLoading ? '...' : blogs.length}
            </h3>
            <p className="text-secondary-600 font-medium">مقال منشور</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-brand-sm border border-neutral-200">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-500 mb-1">متنوعة</h3>
            <p className="text-accent-600 font-medium">المواضيع</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-brand-sm border border-neutral-200">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-dark-500 mb-1">محدثة</h3>
            <p className="text-primary-600 font-medium">بشكل دوري</p>
          </div>
        </motion.div>

        {/* قائمة المقالات */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(isLoading ? [1, 2, 3, 4, 5, 6] : blogs.slice(0, 6)).map(
            (blog: any, i: number) => (
              <motion.div
                key={blog?.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full p-6 bg-white border border-neutral-200 shadow-brand-sm hover:shadow-brand-lg transition-all duration-300 relative overflow-hidden">
                  {/* شريط علوي ملون */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-500 to-accent-500"></div>

                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-neutral-200 rounded mb-3"></div>
                      <div className="h-3 bg-neutral-200 w-3/4 mb-2 rounded"></div>
                      <div className="h-3 bg-neutral-200 w-1/2 mb-4 rounded"></div>
                      <div className="h-8 bg-neutral-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      {/* أيقونة المقال */}
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Quote className="w-6 h-6 text-white" />
                      </div>

                      {/* عنوان المقال */}
                      <h3 className="text-lg font-bold text-dark-500 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>

                      {/* ملخص المقال */}
                      <p className="text-sm text-dark-400 line-clamp-3 mb-4 leading-relaxed">
                        {blog.excerpt ||
                          blog.description ||
                          'مقال مثير للاهتمام من فريق شبابنا'}
                      </p>

                      {/* تفاصيل إضافية */}
                      <div className="space-y-2 mb-4">
                        {blog.category && (
                          <div className="flex items-center text-xs text-dark-400">
                            <Target className="w-4 h-4 ml-2" />
                            <span>{blog.category}</span>
                          </div>
                        )}
                        {blog.created_at && (
                          <div className="flex items-center text-xs text-dark-400">
                            <Star className="w-4 h-4 ml-2" />
                            <span>
                              {new Date(blog.created_at).toLocaleDateString(
                                'ar-SA'
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* رابط القراءة */}
                      <Link
                        to={`/blogs/${blog.id || blog.slug}`}
                        className="inline-flex items-center text-secondary-600 text-sm font-semibold hover:text-secondary-700 transition-colors duration-300"
                      >
                        اقرأ المقال
                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </>
                  )}
                </Card>
              </motion.div>
            )
          )}
        </motion.div>

        {/* زر عرض المزيد */}
        {!isLoading && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              to="/blogs"
              className="inline-flex items-center justify-center font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
            >
              عرض جميع المقالات
              <ArrowRight className="w-5 h-5 mr-2" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
});

const CallToAction = memo(() => {
  const navigate = useNavigate();

  return (
    <motion.section
      id="cta"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
            animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full blur-xl"
            animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            انضم إلينا في رحلة التميز
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-lg text-neutral-100 mb-8 max-w-2xl mx-auto"
          >
            كن جزءاً من مجتمع شبابنا العالمي وابدأ رحلتك نحو التميز والتأثير
            الإيجابي
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/join-us')}
              className="inline-flex items-center justify-center font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-primary-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              انضم إلينا الآن
              <ArrowRight className="w-5 h-5 mr-2" />
            </button>
            <button
              onClick={() => navigate('/programs')}
              className="inline-flex items-center justify-center font-semibold px-8 py-3 text-lg rounded-xl transition-all duration-300 border-2 border-white text-white hover:bg-white hover:text-primary-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              تعرف على برامجنا
              <ArrowRight className="w-5 h-5 mr-2" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

const AboutUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      <SEO
        title={t('about.pageTitle', 'من نحن - منصة شبابنا')}
        description={t(
          'about.pageDescription',
          'تعرف على منصة شبابنا ورؤيتنا لبناء مستقبل الشباب المسلم'
        )}
        keywords="من نحن, شبابنا, منظمة شبابنا, الشباب المسلم, التطوير, القيادة"
      />

      <HeroSection />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <AboutUsSection />
        <PresidentMessage />
        <ExecutiveDirectorSection />
        <VisionMission />
        <CoreValues />
        <Achievements />
        <AboutLatestEvents />
        <AboutLatestBlogs />
        <CallToAction />
      </div>
    </div>
  );
};

export default AboutUs;
