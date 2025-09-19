/* eslint-disable */
// cspell:disable-file
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HeartHandshake,
  Lightbulb,
  Globe,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../ui/Card/Card';
import { Button } from '../ui/Button/ButtonSimple';

// تحسين الأداء باستخدام memo
const FeatureCard = memo(
  ({ feature, index }: { feature: any; index: number }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      },
    };

    // تحديد الروابط المناسبة لكل بطاقة
    const getNavigationPath = () => {
      switch (index) {
        case 0: // مجتمع عالمي
          return '/about';
        case 1: // برامج تطويرية
          return '/programs';
        case 2: // ورش وفعاليات
          return '/events';
        default:
          return '/programs';
      }
    };

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="h-full"
      >
        <Card
          variant="elevated"
          className="h-full p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-300 border-0 shadow-md hover:shadow-lg group"
        >
          {/* الأيقونة */}
          <div
            className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-all duration-300`}
          >
            <feature.icon className="w-8 h-8 text-white" />
          </div>

          {/* العنوان */}
          <h3 className="text-xl font-bold text-dark-900 mb-4 leading-tight">
            {feature.title}
          </h3>

          {/* الوصف */}
          <p className="text-dark-600 mb-5 leading-relaxed text-sm line-clamp-2">
            {feature.description}
          </p>

          {/* قائمة النقاط */}
          <ul className="space-y-2.5 mb-6">
            {feature.features.slice(0, 3).map((item: string, idx: number) => (
              <li
                key={idx}
                className="flex items-center gap-2.5 text-sm text-dark-600"
              >
                <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-right">{item}</span>
              </li>
            ))}
          </ul>

          {/* الزر */}
          <Button
            variant="outline"
            size="sm"
            className="w-full py-2.5 text-sm font-semibold border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400 text-primary-700 transition-all duration-200"
            onClick={() => navigate(getNavigationPath())}
          >
            {i18n.isInitialized
              ? t('common.learnMore', 'اعرف المزيد')
              : 'اعرف المزيد'}
            <ArrowRight className="w-4 h-4 mr-1" />
          </Button>
        </Card>
      </motion.div>
    );
  }
);

FeatureCard.displayName = 'FeatureCard';

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: HeartHandshake,
      title: t('home.features.community.title'),
      description: t('home.features.community.description'),
      features: [
        t('home.features.community.features.members'),
        t('home.features.community.features.services'),
        t('home.features.community.features.programs'),
      ],
      gradient: 'from-secondary-600 to-secondary-700',
    },
    {
      icon: Lightbulb,
      title: t('home.features.programs.title'),
      description: t('home.features.programs.description'),
      features: [
        t('home.features.programs.features.leadership'),
        t('home.features.programs.features.skills'),
        t('home.features.programs.features.success'),
      ],
      gradient: 'from-primary-600 to-primary-700',
    },
    {
      icon: Globe,
      title: t('home.features.events.title'),
      description: t('home.features.events.description'),
      features: [
        t('home.features.events.features.regular'),
        t('home.features.events.features.interactive'),
        t('home.features.events.features.networks'),
      ],
      gradient: 'from-accent-600 to-accent-700',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-neutral-50/30" />
      <div className="relative max-w-6xl mx-auto px-6">
        {/* العنوان والوصف - متناسق مع قسم الإحصائيات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-dark-900">
            {t('home.features.title')}
          </h2>
          <p className="text-sm text-dark-500 mt-2">
            {t('home.features.subtitle')}
          </p>
        </motion.div>

        {/* البطاقات */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
