import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Calendar, TrendingUp } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: '1,240+',
      label: 'شباب مشارك',
      color: 'primary',
    },
    {
      icon: Globe,
      number: '18',
      label: 'دولة مشاركة',
      color: 'secondary',
    },
    {
      icon: Calendar,
      number: '87',
      label: 'فعالية منظمة',
      color: 'primary',
    },
    {
      icon: TrendingUp,
      number: '12',
      label: 'برنامج تطويري',
      color: 'secondary',
    },
  ];

  // تحسين الرسوم المتحركة - تقليل التعقيد
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
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
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-neutral-50/30" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* عنوان القسم */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-900 mb-4 sm:mb-6">
            ماذا نقدم
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            إحصائيات حقيقية تعكس تأثير منصتنا في تطوير الشباب المسلم حول العالم
          </p>
        </motion.div>

        {/* شبكة الإحصائيات */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${getColorClasses(
                  stat.color
                )} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-105 transition-all duration-200 shadow-lg group-hover:shadow-xl`}
              >
                <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-900 mb-2 sm:mb-3">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-dark-600 font-medium">
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
