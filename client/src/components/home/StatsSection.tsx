/* eslint-disable */
// cspell:disable-file
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, Globe, Calendar, TrendingUp } from 'lucide-react';
import { useSiteStats } from '../../hooks/useSiteStats';

const StatsSection: React.FC = () => {
  const { t } = useTranslation();

  const { data, loading, countriesCount, anyZero } = useSiteStats();

  const stats = [
    {
      icon: Users,
      number: data ? new Intl.NumberFormat('ar-SA').format(data.users) : '—',
      label: t('home.stats.members'),
      color: 'primary',
    },
    {
      icon: Globe,
      number: new Intl.NumberFormat('ar-SA').format(countriesCount),
      label: t('home.stats.countries'),
      color: 'secondary',
    },
    {
      icon: Calendar,
      number: data ? new Intl.NumberFormat('ar-SA').format(data.events) : '—',
      label: t('home.stats.events'),
      color: 'primary',
    },
    {
      icon: TrendingUp,
      number: data ? new Intl.NumberFormat('ar-SA').format(data.programs) : '—',
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
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-dark-900">
            {anyZero ? 'أهدافنا' : 'أرقامنا'}
          </h2>
          <p className="text-sm text-dark-500 mt-2">
            نظرة سريعة على واقع المنصة اليوم.
          </p>
        </div>
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
                {loading ? '…' : stat.number}
              </div>
              <div className="text-sm text-dark-600 font-medium">
                {stat.label}
              </div>
              {!loading &&
                data &&
                index !== 1 &&
                ((index === 0 && data.users === 0) ||
                  (index === 2 && data.events === 0) ||
                  (index === 3 && data.programs === 0)) && (
                  <div className="text-xs text-dark-500 mt-1">
                    {index === 0 &&
                      t('home.stats.noMembers', 'لا يوجد أعضاء حالياً')}
                    {index === 2 &&
                      t('home.stats.noEvents', 'لا توجد فعاليات حالياً')}
                    {index === 3 &&
                      t('home.stats.noPrograms', 'لا توجد برامج حالياً')}
                  </div>
                )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
