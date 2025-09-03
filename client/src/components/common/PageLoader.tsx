import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  message?: string;
  showProgress?: boolean;
  variant?: 'default' | 'minimal' | 'brand';
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'جاري تحميل الصفحة...',
  showProgress = true,
  variant = 'default',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [showProgress]);

  const renderLoader = () => {
    switch (variant) {
      case 'minimal':
        return <MinimalLoader message={message} />;
      case 'brand':
        return <BrandLoader message={message} progress={progress} />;
      default:
        return <DefaultLoader message={message} progress={progress} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 backdrop-blur-sm flex items-center justify-center z-50 font-arabic"
      >
        {renderLoader()}
      </motion.div>
    </AnimatePresence>
  );
};

// مكون التحميل الافتراضي
const DefaultLoader: React.FC<{
  message: string;
  progress: number;
}> = ({ message, progress }) => (
  <div className="text-center max-w-md mx-auto px-6">
    {/* شعار متحرك */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-8"
    >
      <div className="relative mx-auto w-20 h-20">
        {/* دائرة خارجية */}
        <div className="absolute inset-0 w-20 h-20 border-4 border-primary-200 rounded-full"></div>

        {/* دائرة داخلية متحركة */}
        <motion.div
          className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-primary-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* أيقونة في المنتصف */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
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

    {/* الرسالة */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mb-6"
    >
      <h3 className="text-xl font-semibold text-dark-500 mb-2 font-arabic">
        {message}
      </h3>
      <p className="text-dark-400 text-sm font-arabic">يرجى الانتظار قليلاً</p>
    </motion.div>

    {/* شريط التقدم */}
    {progress > 0 && (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-4"
      >
        <div className="w-full bg-secondary-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-right mt-1">
          <span className="text-xs text-dark-400 font-arabic">
            {Math.round(progress)}%
          </span>
        </div>
      </motion.div>
    )}

    {/* مؤشرات التحميل */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="flex justify-center space-x-2 rtl:space-x-reverse"
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
  </div>
);

// مكون التحميل البسيط
const MinimalLoader: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center max-w-sm mx-auto px-6">
    {/* دائرة بسيطة */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="mx-auto mb-6 w-12 h-12 border-3 border-transparent border-t-primary-500 rounded-full"
    />

    {/* الرسالة */}
    <p className="text-dark-500 text-lg font-medium font-arabic">{message}</p>
  </div>
);

// مكون التحميل بالهوية التجارية
const BrandLoader: React.FC<{
  message: string;
  progress: number;
}> = ({ message, progress }) => (
  <div className="text-center max-w-md mx-auto px-6">
    {/* شعار شبابنا */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-8"
    >
      <div className="relative mx-auto w-24 h-24">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg"></div>

        {/* أيقونة الشباب */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-2xl font-bold"
          >
            شبابنا
          </motion.div>
        </div>
      </div>
    </motion.div>

    {/* الرسالة */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mb-6"
    >
      <h3 className="text-xl font-semibold text-dark-500 mb-2 font-arabic">
        {message}
      </h3>
      <p className="text-dark-400 text-sm font-arabic">
        نحن نبني مستقبلاً أفضل معاً
      </p>
    </motion.div>

    {/* شريط التقدم */}
    {progress > 0 && (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-4"
      >
        <div className="w-full bg-secondary-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-right mt-1">
          <span className="text-xs text-dark-400 font-arabic">
            {Math.round(progress)}%
          </span>
        </div>
      </motion.div>
    )}
  </div>
);

export default PageLoader;
