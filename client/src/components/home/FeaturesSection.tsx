import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HeartHandshake,
  Lightbulb,
  Globe,
  CheckCircle,
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
          className="h-full p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-200 border-0 shadow-md hover:shadow-lg"
        >
          <div
            className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}
          >
            <feature.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-dark-500 mb-3">
            {feature.title}
          </h3>
          <p className="text-dark-600 mb-4 leading-relaxed text-sm">
            {feature.description}
          </p>
          <ul className="space-y-2 mb-4">
            {feature.features.map((item: string, idx: number) => (
              <li
                key={idx}
                className="flex items-center justify-center gap-2 text-xs text-dark-600"
              >
                <CheckCircle className="w-3 h-3 text-primary-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full py-2 text-xs font-semibold border-2 border-dark-300 hover:bg-dark-50 text-dark-700"
            onClick={() => navigate('/programs')}
          >
            {i18n.isInitialized
              ? t('common.learnMore', 'اعرف المزيد')
              : 'اعرف المزيد'}
            <ArrowRight className="w-3 h-3 mr-1" />
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
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/20 to-secondary-50/20" />
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark-500 mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-base md:text-lg text-dark-600 max-w-3xl mx-auto leading-relaxed">
            {t('home.features.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
