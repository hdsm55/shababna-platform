import React, { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Calendar,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Quote,
  Sparkles,
  Zap,
  TrendingUp,
  UserCheck,
  BookOpen,
  Users2,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
} from 'lucide-react';

import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';

// مكون التنقل السريع
const QuickNavigation = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  const sections = [
    { id: 'president', label: 'رسالة الرئيس', icon: Quote },
    { id: 'ceo', label: 'المدير التنفيذي', icon: Zap },
    { id: 'vision', label: 'الرؤية والرسالة', icon: Target },
    { id: 'values', label: 'القيم الأساسية', icon: Star },
    { id: 'achievements', label: 'الإنجازات', icon: Award },
    { id: 'cta', label: 'انضم إلينا', icon: Users2 },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsExpanded(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-primary-200 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 flex items-center justify-center bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-2 space-y-1">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dark-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                  >
                    <section.icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

// تحسين الأداء - مكونات منفصلة
const HeroSection = memo(() => {
  const { t } = useTranslation();

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
                <span className="text-sm font-medium">+10,000 شاب</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Globe className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">50+ دولة</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">100+ برنامج</span>
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
  const [isReading, setIsReading] = useState(false);

  return (
    <motion.section
      id="president"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-br from-white to-primary-50 border border-primary-200 shadow-brand-lg relative overflow-hidden">
            {/* خلفية زخرفية */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative inline-block"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-200 shadow-lg">
                    <img
                      src="/images/team/رئيس المنظمة.jpg"
                      alt={t('about.president.title')}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/fallback.svg';
                      }}
                    />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Quote className="w-3 h-3 text-white" />
                  </motion.div>
                </motion.div>

                <h2 className="text-3xl font-bold text-dark-500 mb-2">
                  {t('about.president.title')}
                </h2>
                <p className="text-primary-600 font-medium mb-4">
                  {t('about.president.name')} - {t('about.president.position')}
                </p>

                <motion.button
                  onClick={() => setIsReading(!isReading)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isReading ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isReading ? 'إيقاف القراءة' : 'قراءة الرسالة'}
                  </span>
                </motion.button>
              </div>

              <div className="text-dark-400 space-y-6 text-base leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {t('about.president.greeting')}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {t('about.president.welcome')}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {t('about.president.vision')}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {t('about.president.mission')}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {t('about.president.commitment')}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {t('about.president.invitation')}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-primary-50 rounded-lg p-4 border-r-4 border-primary-500"
                >
                  <p className="font-medium text-primary-700">
                    {t('about.president.signature')}
                    <br />
                    <span className="text-primary-600">
                      {t('about.president.signatureName')}
                    </span>
                    <br />
                    <span className="text-sm text-primary-500">
                      {t('about.president.signaturePosition')}
                    </span>
                  </p>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
});

// قسم المدير التنفيذي
const ExecutiveDirectorSection = memo(() => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.section
      id="ceo"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-br from-accent-50 to-secondary-50 border border-accent-200 shadow-brand-lg relative overflow-hidden">
            {/* خلفية زخرفية */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent-100 rounded-full -translate-y-16 -translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-secondary-100 rounded-full translate-y-12 translate-x-12 opacity-50"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative inline-block"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-accent-200 shadow-lg">
                    <img
                      src="/images/team/المدير التنفيذي.jpeg"
                      alt={t('about.ceo.title')}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/fallback.svg';
                      }}
                    />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <Zap className="w-3 h-3 text-white" />
                  </motion.div>
                </motion.div>

                <h2 className="text-3xl font-bold text-dark-500 mb-2">
                  {t('about.ceo.title')}
                </h2>
                <p className="text-accent-600 font-medium mb-4">
                  {t('about.ceo.name')} - {t('about.ceo.position')}
                </p>

                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 hover:bg-accent-200 text-accent-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isExpanded ? 'طي الرسالة' : 'عرض الرسالة'}
                  </span>
                </motion.button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-dark-400 space-y-6 text-base leading-relaxed overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="bg-white/60 rounded-lg p-6 border border-accent-200"
                    >
                      <p className="whitespace-pre-line">
                        {t('about.ceo.message')}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="bg-accent-50 rounded-lg p-4 border-r-4 border-accent-500"
                    >
                      <p className="font-medium text-accent-700">
                        {t('about.ceo.signature')}
                        <br />
                        <span className="text-accent-600">
                          {t('about.ceo.signatureName')}
                        </span>
                        <br />
                        <span className="text-sm text-accent-500">
                          {t('about.ceo.signaturePosition')}
                        </span>
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
});

const VisionMission = memo(() => {
  const { t } = useTranslation();

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
          className="text-dark-400 max-w-2xl mx-auto"
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
            <p className="text-dark-400 text-center leading-relaxed relative z-10">
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
            <p className="text-dark-400 text-center leading-relaxed relative z-10">
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
  const { t } = useTranslation();

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
        {values.map((value, index) => (
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
  const { t } = useTranslation();

  const achievements = [
    {
      icon: Users,
      number: '10,000+',
      label: 'شاب وشابة',
      description: 'انضموا لبرامجنا',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Globe,
      number: '50+',
      label: 'دولة',
      description: 'حول العالم',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Award,
      number: '100+',
      label: 'برنامج',
      description: 'تطويري ومؤثر',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'رضا',
      description: 'من المشاركين',
      color: 'from-orange-500 to-orange-600',
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
          إنجازاتنا بالأرقام
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-dark-400 max-w-2xl mx-auto"
        >
          أرقام تتحدث عن تأثيرنا الإيجابي في حياة الشباب حول العالم
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {achievements.map((achievement, index) => (
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
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
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

const CallToAction = memo(() => {
  const { t } = useTranslation();
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
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/join')}
              className="bg-white text-primary-600 hover:bg-neutral-100 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              انضم إلينا الآن
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/programs')}
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
            >
              تعرف على برامجنا
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
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
      <QuickNavigation />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <PresidentMessage />
        <ExecutiveDirectorSection />
        <VisionMission />
        <CoreValues />
        <Achievements />
        <CallToAction />
      </div>
    </div>
  );
};

export default AboutUs;
