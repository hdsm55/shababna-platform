import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Sparkles,
  Users,
  Globe,
  Award,
  Calendar,
} from 'lucide-react';
import { Button } from '../ui/Button/ButtonSimple';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundPosition: 'center center',
        }}
        loading="eager"
      />

      {/* Enhanced Dark Overlay - استخدام اللون الداكن المعتمد */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-500/70 via-dark-600/50 to-dark-700/70" />

      {/* Brand Gradient Overlay - استخدام الألوان المعتمدة */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-secondary-800/50 to-dark-900/60" />

      {/* Simplified Background Elements - تقليل التأثيرات الثقيلة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-400/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh]">
          {/* Left Column - Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-right space-y-6"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              {t('home.hero.badge')}
            </motion.div>

            {/* Main Title */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {t('home.hero.subtitle')}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center pt-2"
            >
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 text-base font-semibold shadow-lg"
              >
                <span className="flex items-center gap-2">
                  إنشاء حساب
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/events')}
                className="border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 text-base font-semibold backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  {t('nav.events')}
                  <Calendar className="w-4 h-4" />
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Logo */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.img
                src="/images/logo-shababna.png"
                alt="شعار شبابنا"
                className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 object-contain drop-shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                loading="eager"
              />
              {/* Subtle glow effect behind logo */}
              <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-110" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
