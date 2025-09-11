import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  Sparkles,
  Zap,
  Heart,
  Star,
  Globe,
  Users,
  Target,
  Award,
} from 'lucide-react';

/**
 * Unified Loading Component - مكون التحميل الموحد
 * يحل محل جميع مكونات التحميل الأخرى ويوفر تجربة موحدة
 */
interface UnifiedLoaderProps {
  // الحالة والرسالة
  message?: string;
  showProgress?: boolean;
  progress?: number;

  // التصميم والمظهر
  variant?: 'default' | 'minimal' | 'brand' | 'modern' | 'elegant' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'neutral';

  // المميزات الإضافية
  showLogo?: boolean;
  showTips?: boolean;
  isBackendIdle?: boolean;
  fullScreen?: boolean;

  // التخصيص
  className?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const UnifiedLoader: React.FC<UnifiedLoaderProps> = ({
  message,
  showProgress = false,
  progress: externalProgress,
  variant = 'default',
  size = 'md',
  color = 'primary',
  showLogo = true,
  showTips = false,
  isBackendIdle = false,
  fullScreen = false,
  className,
  autoHide = false,
  autoHideDelay = 3000,
}) => {
  const { t } = useTranslation();
  const [internalProgress, setInternalProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // الرسالة الافتراضية
  const defaultMessage = t('common.loading', 'جاري التحميل...');
  const finalMessage = message || defaultMessage;
  const finalProgress =
    externalProgress !== undefined ? externalProgress : internalProgress;

  // نصائح التحميل المحسنة
  const loadingTips = [
    {
      text: t(
        'loading.tip1',
        '💡 نصيحة: يمكنك تصفح الفعاليات والبرامج أثناء التحميل'
      ),
      icon: Sparkles,
    },
    {
      text: t('loading.tip2', '🌟 اكتشف برامجنا التطويرية المميزة'),
      icon: Star,
    },
    {
      text: t('loading.tip3', '📱 تابعنا على وسائل التواصل الاجتماعي'),
      icon: Globe,
    },
    {
      text: t('loading.tip4', '🎯 انضم إلى مجتمع شبابنا العالمي'),
      icon: Users,
    },
    { text: t('loading.tip5', '⚡ استفد من فرص التطوير المهني'), icon: Zap },
    { text: t('loading.tip6', '❤️ شارك في مبادراتنا الإنسانية'), icon: Heart },
    { text: t('loading.tip7', '🏆 احصل على شهادات معتمدة'), icon: Award },
    { text: t('loading.tip8', '🎯 حقق أهدافك مع شبابنا'), icon: Target },
  ];

  // محاكاة التقدم
  useEffect(() => {
    if (showProgress && externalProgress === undefined) {
      const interval = setInterval(() => {
        setInternalProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10 + 2;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [showProgress, externalProgress]);

  // تبديل النصائح
  useEffect(() => {
    if (showTips) {
      const tipInterval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % loadingTips.length);
      }, 4000);

      return () => clearInterval(tipInterval);
    }
  }, [showTips, loadingTips.length]);

  // الإخفاء التلقائي
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay]);

  // تحديد نوع التحميل
  const renderSpinner = () => {
    const spinnerSize =
      size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
    const colorClass =
      color === 'primary'
        ? 'border-primary-500'
        : color === 'secondary'
        ? 'border-secondary-500'
        : color === 'accent'
        ? 'border-accent-500'
        : 'border-neutral-500';

    switch (variant) {
      case 'minimal':
        return (
          <motion.div
            className={clsx(
              'rounded-full border-2 border-t-transparent',
              spinnerSize,
              colorClass
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        );

      case 'brand':
        return (
          <motion.div
            className={clsx(
              'relative rounded-full bg-gradient-to-br from-primary-500 to-secondary-500',
              spinnerSize
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
              <motion.div
                className="text-primary-600 font-bold text-xs"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                شبابنا
              </motion.div>
            </div>
          </motion.div>
        );

      case 'modern':
        return (
          <div className="relative">
            <motion.div
              className={clsx(
                'rounded-full border-2 border-t-transparent',
                spinnerSize,
                colorClass
              )}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-r-primary-300"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        );

      case 'elegant':
        return (
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={clsx(
                  'rounded-full',
                  size === 'sm'
                    ? 'w-1.5 h-1.5'
                    : size === 'lg'
                    ? 'w-3 h-3'
                    : 'w-2 h-2',
                  color === 'primary'
                    ? 'bg-primary-500'
                    : color === 'secondary'
                    ? 'bg-secondary-500'
                    : color === 'accent'
                    ? 'bg-accent-500'
                    : 'bg-neutral-500'
                )}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );

      case 'premium':
        return (
          <div className="relative">
            <motion.div
              className={clsx(
                'rounded-full border-4 border-t-transparent',
                spinnerSize,
                'border-gradient-to-r from-primary-500 via-secondary-500 to-accent-500'
              )}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-1 rounded-full border-2 border-transparent border-r-primary-300"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        );

      default:
        return (
          <motion.div
            className={clsx(
              'rounded-full border-2 border-t-transparent',
              spinnerSize,
              colorClass
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        );
    }
  };

  // تحديد حجم الحاوية
  const containerSize =
    size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-md';

  // تحديد خلفية الشاشة الكاملة
  const backgroundClass = fullScreen
    ? 'fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 z-50 flex items-center justify-center'
    : 'flex flex-col items-center gap-4';

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={clsx(backgroundClass, className)}
      >
        <div className={clsx('text-center mx-auto px-6', containerSize)}>
          {/* الشعار */}
          {showLogo && variant !== 'minimal' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-6"
            >
              {variant === 'brand' ? (
                <motion.div
                  className="relative mx-auto w-16 h-16"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <img
                    src="/images/logo.svg"
                    alt="شبابنا"
                    className="w-16 h-16 object-contain logo"
                    style={{ backgroundColor: 'transparent' }}
                  />
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: 360,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Star className="w-2 h-2 text-white" />
                  </motion.div>
                </motion.div>
              ) : (
                <div className="relative mx-auto w-12 h-12">
                  <div className="absolute inset-0 w-12 h-12 border-4 border-primary-200 rounded-full"></div>
                  <motion.div
                    className="absolute inset-2 w-8 h-8 border-4 border-transparent border-t-primary-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* التحميل الرئيسي */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {renderSpinner()}
            {finalMessage && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-dark-600 text-sm font-medium rtl:text-right"
              >
                {finalMessage}
              </motion.span>
            )}
          </div>

          {/* شريط التقدم المحسن */}
          {showProgress && finalProgress > 0 && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4"
            >
              <div className="w-full bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-full h-3 overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${finalProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  {/* تأثير اللمعان */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-dark-500 font-medium">
                  {t('loading.progress', 'جاري التحميل...')}
                </span>
                <span className="text-xs text-primary-600 font-bold font-arabic">
                  {Math.round(finalProgress)}%
                </span>
              </div>
            </motion.div>
          )}

          {/* نصائح التحميل المحسنة */}
          {showTips && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-4"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 rounded-xl p-4 border border-primary-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {React.createElement(loadingTips[currentTip].icon, {
                        className: 'w-4 h-4 text-white',
                      })}
                    </motion.div>
                    <p className="text-dark-600 text-sm font-medium font-arabic leading-relaxed">
                      {loadingTips[currentTip].text}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* حالة الخادم المجاني */}
          {isBackendIdle && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-sm text-neutral-600 mb-3 font-medium">
                {t('loading.backendIdle', 'الخادم المجاني يستيقظ من النوم')}
              </p>
              <div className="flex items-center justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* مؤشرات التحميل */}
          {variant !== 'minimal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex justify-center space-x-2 rtl:space-x-reverse mt-4"
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UnifiedLoader;
