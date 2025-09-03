import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  message?: string;
  showProgress?: boolean;
  estimatedTime?: number; // بالثواني
  variant?: 'default' | 'minimal' | 'skeleton' | 'wave';
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'جاري تحميل الصفحة...',
  showProgress = true,
  estimatedTime = 3,
  variant = 'default',
}) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // محاكاة تقدم التحميل
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

  // مكونات التحميل المختلفة
  const renderLoader = () => {
    switch (variant) {
      case 'minimal':
        return <MinimalLoader message={message} dots={dots} />;
      case 'skeleton':
        return <SkeletonLoader message={message} />;
      case 'wave':
        return <WaveLoader message={message} />;
      default:
        return (
          <DefaultLoader message={message} progress={progress} dots={dots} />
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
        className="fixed inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-100/50 backdrop-blur-sm flex items-center justify-center z-50"
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
  dots: string;
}> = ({ message, progress, dots }) => (
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
        <div className="absolute inset-0 w-20 h-20 border-4 border-blue-100 rounded-full"></div>

        {/* دائرة داخلية متحركة */}
        <motion.div
          className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* أيقونة في المنتصف */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
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
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
      <p className="text-gray-600 text-sm">يرجى الانتظار قليلاً{dots}</p>
    </motion.div>

    {/* شريط التقدم */}
    {progress > 0 && (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-4"
      >
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-right mt-1">
          <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
        </div>
      </motion.div>
    )}

    {/* مؤشرات التحميل */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="flex justify-center space-x-2"
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-blue-400 rounded-full"
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
const MinimalLoader: React.FC<{ message: string; dots: string }> = ({
  message,
  dots,
}) => (
  <div className="text-center max-w-sm mx-auto px-6">
    {/* دائرة بسيطة */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="mx-auto mb-6 w-12 h-12 border-3 border-transparent border-t-blue-500 rounded-full"
    />

    {/* الرسالة */}
    <p className="text-gray-700 text-lg font-medium">
      {message}
      {dots}
    </p>
  </div>
);

// مكون التحميل الهيكلي
const SkeletonLoader: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center max-w-md mx-auto px-6">
    {/* رسالة */}
    <h3 className="text-xl font-semibold text-gray-800 mb-6">{message}</h3>

    {/* هيكل عظمي متحرك */}
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

    {/* دائرة في الأسفل */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className="mx-auto mt-6 w-8 h-8 border-2 border-transparent border-t-blue-500 rounded-full"
    />
  </div>
);

// مكون التحميل الموجي
const WaveLoader: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center max-w-sm mx-auto px-6">
    {/* الرسالة */}
    <h3 className="text-xl font-semibold text-gray-800 mb-8">{message}</h3>

    {/* موجات متحركة */}
    <div className="flex justify-center space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-8 bg-blue-500 rounded-full"
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

export default PageLoader;
