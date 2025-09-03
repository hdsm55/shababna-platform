import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartPageLoaderProps {
  message?: string;
  showProgress?: boolean;
  estimatedTime?: number;
  variant?: 'default' | 'minimal' | 'skeleton' | 'wave' | 'pulse' | 'dots';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark' | 'brand';
}

const SmartPageLoader: React.FC<SmartPageLoaderProps> = ({
  message = 'جاري تحميل الصفحة...',
  showProgress = true,
  estimatedTime = 3,
  variant = 'default',
  size = 'medium',
  theme = 'light',
}) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'جاري تحميل البيانات...',
    'جاري معالجة المحتوى...',
    'جاري تجهيز الصفحة...',
    'اكتمل التحميل!',
  ];

  useEffect(() => {
    // محاكاة تقدم التحميل
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [showProgress]);

  useEffect(() => {
    // تأثير النقاط المتحركة
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // تغيير الخطوات
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) return 0;
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // الحصول على الألوان حسب الثيم
  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'from-gray-900 via-gray-800 to-gray-900',
          primary: 'blue-400',
          secondary: 'gray-600',
          text: 'text-gray-100',
          textSecondary: 'text-gray-300',
        };
      case 'brand':
        return {
          bg: 'from-blue-600 via-indigo-600 to-purple-600',
          primary: 'white',
          secondary: 'blue-200',
          text: 'text-white',
          textSecondary: 'text-blue-100',
        };
      default:
        return {
          bg: 'from-white via-blue-50/30 to-indigo-100/50',
          primary: 'blue-500',
          secondary: 'gray-400',
          text: 'text-gray-800',
          textSecondary: 'text-gray-600',
        };
    }
  };

  const colors = getThemeColors();

  // الحصول على الأحجام
  const getSizes = () => {
    switch (size) {
      case 'small':
        return { container: 'max-w-sm', icon: 'w-12 h-12', text: 'text-base' };
      case 'large':
        return { container: 'max-w-lg', icon: 'w-24 h-24', text: 'text-2xl' };
      default:
        return { container: 'max-w-md', icon: 'w-20 h-20', text: 'text-xl' };
    }
  };

  const sizes = getSizes();

  // مكونات التحميل المختلفة
  const renderLoader = () => {
    switch (variant) {
      case 'minimal':
        return (
          <MinimalLoader
            message={message}
            dots={dots}
            colors={colors}
            sizes={sizes}
          />
        );
      case 'skeleton':
        return (
          <SkeletonLoader message={message} colors={colors} sizes={sizes} />
        );
      case 'wave':
        return <WaveLoader message={message} colors={colors} sizes={sizes} />;
      case 'pulse':
        return <PulseLoader message={message} colors={colors} sizes={sizes} />;
      case 'dots':
        return <DotsLoader message={message} colors={colors} sizes={sizes} />;
      default:
        return (
          <DefaultLoader
            message={message}
            progress={progress}
            dots={dots}
            currentStep={currentStep}
            steps={steps}
            colors={colors}
            sizes={sizes}
          />
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 bg-gradient-to-br ${colors.bg} backdrop-blur-sm flex items-center justify-center z-50`}
      >
        {renderLoader()}
      </motion.div>
    </AnimatePresence>
  );
};

// مكون التحميل الافتراضي
const DefaultLoader: React.FC<any> = ({
  message,
  progress,
  dots,
  currentStep,
  steps,
  colors,
  sizes,
}) => (
  <div className={`text-center ${sizes.container} mx-auto px-6`}>
    {/* شعار متحرك */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-8"
    >
      <div className={`relative mx-auto ${sizes.icon}`}>
        {/* دائرة خارجية */}
        <div
          className={`absolute inset-0 ${sizes.icon} border-4 border-${colors.secondary} rounded-full`}
        ></div>

        {/* دائرة داخلية متحركة */}
        <motion.div
          className={`absolute inset-2 w-16 h-16 border-4 border-transparent border-t-${colors.primary} rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* أيقونة في المنتصف */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-8 h-8 bg-${colors.primary} rounded-full flex items-center justify-center`}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>

    {/* الرسالة الرئيسية */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mb-4"
    >
      <h3 className={`${sizes.text} font-semibold ${colors.text} mb-2`}>
        {message}
      </h3>
      <p className={`text-sm ${colors.textSecondary}`}>
        يرجى الانتظار قليلاً{dots}
      </p>
    </motion.div>

    {/* الخطوات */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mb-4"
    >
      <p className={`text-sm ${colors.textSecondary}`}>{steps[currentStep]}</p>
    </motion.div>

    {/* شريط التقدم */}
    {progress > 0 && (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-4"
      >
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r from-${colors.primary} to-indigo-500 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-right mt-1">
          <span className={`text-xs ${colors.textSecondary}`}>
            {Math.round(progress)}%
          </span>
        </div>
      </motion.div>
    )}

    {/* مؤشرات التحميل */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex justify-center space-x-2"
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 bg-${colors.primary} rounded-full`}
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
  </div>
);

// مكون التحميل البسيط
const MinimalLoader: React.FC<any> = ({ message, dots, colors, sizes }) => (
  <div className={`text-center ${sizes.container} mx-auto px-6`}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`mx-auto mb-6 ${sizes.icon} border-3 border-transparent border-t-${colors.primary} rounded-full`}
    />

    <p className={`${sizes.text} font-medium ${colors.text}`}>
      {message}
      {dots}
    </p>
  </div>
);

// مكون التحميل الهيكلي
const SkeletonLoader: React.FC<any> = ({ message, colors, sizes }) => (
  <div className={`text-center ${sizes.container} mx-auto px-6`}>
    <h3 className={`${sizes.text} font-semibold ${colors.text} mb-6`}>
      {message}
    </h3>

    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-4 bg-gray-200 rounded"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>

    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className={`mx-auto mt-6 w-8 h-8 border-2 border-transparent border-t-${colors.primary} rounded-full`}
    />
  </div>
);

// مكون التحميل الموجي
const WaveLoader: React.FC<any> = ({ message, colors, sizes }) => (
  <div className={`text-center ${sizes.container} mx-auto px-6`}>
    <h3 className={`${sizes.text} font-semibold ${colors.text} mb-8`}>
      {message}
    </h3>

    <div className="flex justify-center space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`w-2 h-8 bg-${colors.primary} rounded-full`}
          animate={{
            height: [8, 32, 8],
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
  </div>
);

// مكون التحميل النبضي
const PulseLoader: React.FC<any> = ({ message, colors, sizes }) => (
  <div className={`text-center ${sizes.container} mx-auto px-6`}>
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`mx-auto mb-6 ${sizes.icon} bg-${colors.primary} rounded-full flex items-center justify-center`}
    >
      <svg
        className="w-8 h-8 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
    </motion.div>

    <p className={`${sizes.text} font-medium ${colors.text}`}>{message}</p>
  </div>
);

// مكون التحميل بالنقاط
const DotsLoader: React.FC<any> = ({ message, colors, sizes }) => (
  <div className={`text-center ${sizes.container} mx-auto px-6`}>
    <h3 className={`${sizes.text} font-semibold ${colors.text} mb-6`}>
      {message}
    </h3>

    <div className="flex justify-center space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-3 h-3 bg-${colors.primary} rounded-full`}
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  </div>
);

export default SmartPageLoader;
