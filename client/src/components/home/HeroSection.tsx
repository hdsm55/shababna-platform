import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { Button } from '../ui/Button/ButtonSimple';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  // تحسين الرسوم المتحركة - تقليل التعقيد
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* تحسين تحميل الصورة الخلفية */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundPosition: 'center center',
          willChange: 'auto', // تحسين الأداء
        }}
      />

      {/* تحسين الطبقات - تقليل التعقيد */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-500/90 via-dark-600/80 to-dark-700/90" />

      {/* إزالة العناصر الخلفية الثقيلة */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-secondary-800/20 to-dark-900/30" />

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 sm:space-y-8"
        >
          {/* الشارة */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 mb-4 sm:mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent-400" />
              <span className="text-sm sm:text-base font-semibold text-white">
                منصة شبابنا العالمية
              </span>
            </div>
          </motion.div>

          {/* العنوان الرئيسي */}
          <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              شبابنا العالمية
              <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary-200 mt-4 sm:mt-6 font-medium">
                منصة تطوير الشباب المسلم
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed font-medium px-2 sm:px-0">
              نربط شباب العالم الإسلامي من خلال برامج تطويرية متقدمة وفعاليات
              تفاعلية لبناء قادة الغد
            </p>
          </motion.div>

          {/* الأزرار الرئيسية */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12"
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl text-base sm:text-lg"
              onClick={() => navigate('/programs')}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 sm:ml-3" />
              اكتشف البرامج
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white/15 font-bold py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-sm text-base sm:text-lg"
              onClick={() => navigate('/events')}
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 sm:ml-3" />
              الفعاليات
            </Button>
          </motion.div>

          {/* الدعوة الثانوية */}
          <motion.div variants={itemVariants} className="mb-12 sm:mb-16">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-200 mb-4 sm:mb-6 font-medium px-2 sm:px-0">
              انضم إلى مجتمعنا المتنامي من الشباب الطموح
            </p>
            <Button
              variant="outline"
              size="md"
              className="border-2 border-primary-400/60 text-primary-200 hover:bg-primary-400/20 font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-all duration-200 backdrop-blur-sm text-base sm:text-lg"
              onClick={() => navigate('/join-us')}
            >
              انضم إلينا الآن
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
