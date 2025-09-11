import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

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
  variant?: 'default' | 'minimal' | 'brand' | 'modern' | 'elegant';
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

  // نصائح التحميل
  const loadingTips = [
    t('loading.tip1', 'نحن نعمل على تحضير أفضل تجربة لك'),
    t('loading.tip2', 'جاري تحميل المحتوى المطلوب'),
    t('loading.tip3', 'شكراً لصبرك، سنكون جاهزين قريباً'),
    t('loading.tip4', 'نحن نضمن لك تجربة سلسة ومريحة'),
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
      }, 3000);

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
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-white text-xl font-bold"
                    >
                      شبابنا
                    </motion.div>
                  </div>
                </div>
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

          {/* شريط التقدم */}
          {showProgress && finalProgress > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4"
            >
              <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${finalProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-dark-400 font-arabic">
                  {Math.round(finalProgress)}%
                </span>
              </div>
            </motion.div>
          )}

          {/* نصائح التحميل */}
          {showTips && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-4"
            >
              <motion.div
                key={currentTip}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-3 border border-primary-100"
              >
                <p className="text-dark-600 text-sm font-medium font-arabic">
                  💡 {loadingTips[currentTip]}
                </p>
              </motion.div>
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
