import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Heart } from 'lucide-react';

interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // التحقق من أن هذا هو التحميل الأولي للتطبيق
    const isInitialLoad = !sessionStorage.getItem('appInitialized');

    if (!isInitialLoad) {
      // إذا لم يكن هذا التحميل الأولي، لا تظهر شاشة التحميل
      setIsLoading(false);
      return;
    }

    // تأخير قصير لضمان تحميل جميع المكونات
    const timer = setTimeout(() => {
      setIsLoading(false);
      // وضع علامة أن التطبيق تم تهيئته
      sessionStorage.setItem('appInitialized', 'true');
    }, 1000);

    // محاكاة التقدم
    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 20;
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
        <div className="text-center">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <Sparkles className="w-full h-full text-blue-500" />
              </motion.div>

              {/* Floating Hearts */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -left-2"
              >
                <Heart className="w-4 h-4 text-red-400" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-2 -right-2"
              >
                <Heart className="w-4 h-4 text-pink-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Loading Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="mb-6"
          >
            <Loader2 className="w-8 h-8 text-blue-600 mx-auto" />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              شبابنا العالمية
            </h2>
            <p className="text-gray-600 text-sm">جاري تحميل الموقع...</p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.5 }}
            className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden"
          >
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          </motion.div>

          {/* Loading Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center space-x-1 mt-4"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            ))}
          </motion.div>

          {/* Motivating Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-gray-500 text-xs"
          >
            <p>نحن نبني مستقبلاً أفضل معاً</p>
            <p>We're building a better future together</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppLoader;
