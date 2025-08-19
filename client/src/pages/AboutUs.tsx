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
                alt="رئيس المنظمة"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/fallback.svg';
                }}
              />
            </div>
            <h2 className="text-2xl font-bold text-dark-500 mb-1">
              كلمة رئيس المنظمة
            </h2>
            <p className="text-sm text-dark-400">أحمد محمد علي</p>
          </div>

          <div className="prose prose-sm max-w-none text-dark-500 leading-relaxed">
            <p className="mb-4">
              بسم الله الرحمن الرحيم، الحمد لله رب العالمين، والصلاة والسلام على
              سيدنا محمد وعلى آله وصحبه أجمعين.
            </p>
            <p className="mb-4">
              أهلاً وسهلاً بكم في منصة شبابنا العالمية، منصة تهدف إلى تمكين
              الشباب المسلم وبناء مستقبل مشرق له ولأمته.
            </p>
            <p className="mb-4">
              نحن نؤمن بأن الشباب هم عماد الأمة وثروتها الحقيقية، ومن خلال هذه
              المنصة نسعى إلى توفير بيئة إيجابية ومحفزة للشباب المسلم ليتعلم
              وينمو ويطور مهاراته وقدراته.
            </p>
            <p>
              نعمل معاً من قلب اسطنبول، مدينة الجسور بين الشرق والغرب، لنكون
              جسراً للتواصل والتعاون بين الشباب المسلم في جميع أنحاء العالم.
            </p>
          </div>
        </Card>
      </div>
    </motion.section>
  );
});

const VisionMission = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* الرؤية */}
        <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-brand-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mr-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-dark-500">رؤيتنا</h2>
          </div>
          <p className="text-dark-500 leading-relaxed">
            نسعى لأن نكون المنصة الرائدة عالمياً في تمكين الشباب المسلم وبناء
            مستقبل مشرق له ولأمته، من خلال توفير بيئة إيجابية ومحفزة للتعلم
            والنمو والتطوير.
          </p>
        </Card>

        {/* الرسالة */}
        <Card className="p-6 bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 shadow-brand-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mr-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-dark-500">رسالتنا</h2>
          </div>
          <p className="text-dark-500 leading-relaxed">
            تمكين الشباب المسلم من خلال توفير برامج ومبادرات مبتكرة تساهم في
            تطوير مهاراته وقدراته، وتعزيز قيمه الإسلامية، وبناء شخصية متوازنة
            ومؤثرة في المجتمع.
          </p>
        </Card>
      </div>
    </motion.section>
  );
});

const CoreValues = memo(() => {
  const values = [
    {
      icon: Shield,
      title: 'الأمانة',
      description: 'نلتزم بالأمانة والشفافية في جميع أعمالنا',
    },
    {
      icon: Star,
      title: 'التميز',
      description: 'نسعى للتميز في كل ما نقدمه من خدمات',
    },
    {
      icon: Users,
      title: 'التعاون',
      description: 'نؤمن بقوة العمل الجماعي والتعاون المشترك',
    },
    {
      icon: Lightbulb,
      title: 'الابتكار',
      description: 'نشجع الابتكار والإبداع في حل المشكلات',
    },
    {
      icon: Globe,
      title: 'العالمية',
      description: 'نعمل على مستوى عالمي لخدمة الشباب المسلم',
    },
    {
      icon: Heart,
      title: 'الرحمة',
      description: 'نعامل الجميع بالرحمة واللطف والاحترام',
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
          القيم التي تحكم عملنا وتوجه رؤيتنا المستقبلية
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {values.map((value, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="group"
          >
            <Card className="h-full p-4 text-center border border-neutral-200 shadow-brand-sm bg-white hover:shadow-brand-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary-500 rounded-full flex items-center justify-center">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-dark-500 mb-2">
                {value.title}
              </h3>
              <p className="text-xs text-dark-400">{value.description}</p>
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
      label: 'شاب',
      description: 'شاب مسلم مستفيد',
    },
    {
      number: '50+',
      label: 'فعالية',
      description: 'فعالية ناجحة',
    },
    {
      number: '20+',
      label: 'برنامج',
      description: 'برنامج تطويري',
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
    <div className="min-h-screen bg-gradient-brand-light">
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

      <div className="container mx-auto px-4 py-8">
        <PresidentMessage />
        <VisionMission />
        <CoreValues />
        <Achievements />
      </div>
    </div>
  );
};

export default AboutUs;
