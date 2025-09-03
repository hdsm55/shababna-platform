import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, Globe, Calendar, TrendingUp } from 'lucide-react';

const StatsSection: React.FC = () => {
  const { t } = useTranslation();

  // استخدام البيانات من الترجمة
  const stats = [
    {
      icon: Users,
      number: t('home.stats.membersNumber'),
      label: t('home.stats.members'),
      color: 'primary',
    },
    {
      icon: Globe,
      number: t('home.stats.countriesNumber'),
      label: t('home.stats.countries'),
      color: 'secondary',
    },
    {
      icon: Calendar,
      number: t('home.stats.eventsNumber'),
      label: t('home.stats.events'),
      color: 'primary',
    },
    {
      icon: TrendingUp,
      number: t('home.stats.programsNumber'),
      label: t('home.stats.programs'),
      color: 'secondary',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'from-primary-600 to-primary-700';
      case 'secondary':
        return 'from-secondary-600 to-secondary-700';
      case 'accent':
        return 'from-accent-600 to-accent-700';
      default:
        return 'from-primary-600 to-primary-700';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-neutral-50/30" />
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(
                  stat.color
                )} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-dark-900 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-dark-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
