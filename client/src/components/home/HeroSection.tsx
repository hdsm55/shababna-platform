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

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6 py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            {t('home.hero.badge')}
          </motion.div>

          {/* Main Title */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/programs')}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 text-lg font-semibold shadow-lg"
            >
              <span className="flex items-center gap-2">
                {t('home.hero.cta')}
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/events')}
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                {t('nav.events')}
                <Calendar className="w-5 h-5" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
