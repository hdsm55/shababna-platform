import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
} from 'lucide-react';

import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';

// تحسين الأداء - مكونات منفصلة
const HeroSection = memo(() => {
  const { t } = useTranslation();

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section className="bg-gradient-brand-hero text-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-4"
        >
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            src="/images/logo.jpg"
            alt="شبابنا العالمية"
            className="h-16 w-16 object-cover rounded-2xl mx-auto mb-4 shadow-lg"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            {t('about.title', 'من نحن')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base md:text-lg text-neutral-100 max-w-2xl mx-auto"
          >
            {t(
              'about.subtitle',
              'منصة شبابنا العالمية - من قلب اسطنبول، نعمل معاً لبناء مستقبل الشباب المسلم في العالم'
            )}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
});

const PresidentMessage = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 bg-white border border-neutral-200 shadow-brand-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary-200">
              <img
                src="/images/team/president.jpg"
                alt={t('about.president.title')}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/fallback.svg';
                }}
              />
            </div>
            <h2 className="text-2xl font-bold text-dark-500 mb-1">
              {t('about.president.title')}
            </h2>
            <p className="text-sm text-primary-500">
              {t('about.president.name')} - {t('about.president.position')}
            </p>
          </div>

          <div className="text-dark-400 space-y-4 text-sm leading-relaxed">
            <p>{t('about.president.greeting')}</p>

            <p>{t('about.president.welcome')}</p>

            <p>{t('about.president.vision')}</p>

            <p>{t('about.president.mission')}</p>

            <p>{t('about.president.commitment')}</p>

            <p>{t('about.president.invitation')}</p>

            <p className="font-medium">
              {t('about.president.signature')}
              <br />
              {t('about.president.signatureName')}
              <br />
              {t('about.president.signaturePosition')}
            </p>
          </div>
        </Card>
      </div>
    </motion.section>
  );
});

const VisionMission = memo(() => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* رؤيتنا */}
        <motion.div variants={itemVariants} className="group">
          <Card className="h-full p-6 bg-primary-50 border border-primary-200 shadow-brand-sm">
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark-500 mb-3">رؤيتنا</h3>
            </div>
            <p className="text-sm text-dark-400 text-center leading-relaxed">
              نسعى لأن نكون المنصة الرائدة عالمياً في تطوير وتمكين الشباب
              المسلم، وإعدادهم ليكونوا قادة الغد المؤثرين في مجتمعاتهم والعالم.
            </p>
          </Card>
        </motion.div>

        {/* رسالتنا */}
        <motion.div variants={itemVariants} className="group">
          <Card className="h-full p-6 bg-secondary-50 border border-secondary-200 shadow-brand-sm">
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-secondary-500 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark-500 mb-3">رسالتنا</h3>
            </div>
            <p className="text-sm text-dark-400 text-center leading-relaxed">
              توفير منصة رقمية شاملة تجمع الشباب المسلم من جميع أنحاء العالم،
              وتوفر لهم البرامج والفعاليات المتنوعة لتطوير مهاراتهم، وتعزيز
              قيمهم، وتمكينهم من المساهمة في بناء مجتمعاتهم.
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
      icon: Heart,
      title: 'التميز',
      description: 'نسعى للتميز في كل ما نقوم به من برامج وفعاليات',
      color: 'text-accent-500',
    },
    {
      icon: Shield,
      title: 'الشفافية',
      description: 'نؤمن بالشفافية الكاملة في جميع أعمالنا وبرامجنا',
      color: 'text-primary-500',
    },
    {
      icon: Users,
      title: 'التعاون',
      description: 'نعمل معاً كفريق واحد لتحقيق أهدافنا المشتركة',
      color: 'text-secondary-500',
    },
    {
      icon: Lightbulb,
      title: 'الابتكار',
      description: 'نبتكر حلولاً جديدة ومبتكرة لتحديات الشباب',
      color: 'text-accent-500',
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-500 mb-3">
          قيمنا الأساسية
        </h2>
        <p className="text-sm text-dark-400 max-w-xl mx-auto">
          القيم التي نؤمن بها ونسعى لتطبيقها في جميع أعمالنا وبرامجنا
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {values.map((value, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="group"
          >
            <Card className="h-full p-4 text-center border border-neutral-200 shadow-brand-sm">
              <div
                className={`w-10 h-10 mx-auto mb-3 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors duration-200`}
              >
                <value.icon className={`w-5 h-5 ${value.color}`} />
              </div>
              <h3 className="text-lg font-bold text-dark-500 mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-dark-400">{value.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
});

const Achievements = memo(() => {
  const achievements = [
    {
      number: '1000+',
      label: 'شاب وشابة',
      description: 'عدد الشباب المستفيدين من برامجنا',
    },
    {
      number: '50+',
      label: 'فعالية',
      description: 'فعالية ناجحة تم تنظيمها',
    },
    {
      number: '20+',
      label: 'برنامج',
      description: 'برنامج تطويري تم إطلاقه',
    },
    {
      number: '10+',
      label: 'شريك',
      description: 'شريك استراتيجي في التطوير',
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-500 mb-3">إنجازاتنا</h2>
        <p className="text-sm text-dark-400 max-w-xl mx-auto">
          إنجازاتنا التي نفخر بها في خدمة الشباب المسلم
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="group"
          >
            <Card className="h-full p-4 text-center border border-neutral-200 shadow-brand-sm bg-accent-50">
              <div className="w-12 h-12 mx-auto mb-3 bg-accent-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-accent-600 mb-1">
                {achievement.number}
              </div>
              <h3 className="text-base font-bold text-dark-500 mb-1">
                {achievement.label}
              </h3>
              <p className="text-xs text-dark-400">{achievement.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
});

const AboutUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background decoration - مطابق لصفحات Contact/JoinUs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent-200 rounded-full blur-2xl opacity-25" />
      </motion.div>
      <SEO
        title={t('about.pageTitle', 'من نحن - منصة شبابنا')}
        description={t(
          'about.pageDescription',
          'تعرف على منصة شبابنا ورؤيتنا لبناء مستقبل الشباب المسلم'
        )}
        type="website"
        keywords={['منصة شبابنا', 'من نحن', 'رؤيتنا', 'رسالتنا', 'قيمنا']}
      />

      <HeroSection />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <PresidentMessage />
        <VisionMission />
        <CoreValues />
        <Achievements />
      </div>
    </div>
  );
};

export default AboutUs;
