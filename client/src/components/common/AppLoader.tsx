import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // إخفاء الفوتر والهيدر فوراً
    const hideElements = () => {
      const footer = document.querySelector('footer');
      const header = document.querySelector('header');
      const main = document.querySelector('main');

      if (footer) footer.style.display = 'none';
      if (header) header.style.zIndex = '1';
      if (main) main.style.display = 'none';
    };

    // إظهار العناصر بعد انتهاء التحميل
    const showElements = () => {
      const footer = document.querySelector('footer');
      const header = document.querySelector('header');
      const main = document.querySelector('main');

      if (footer) footer.style.display = '';
      if (header) header.style.zIndex = '';
      if (main) main.style.display = '';
    };

    // إخفاء العناصر فوراً
    hideElements();

    // محاكاة التقدم
    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 10;
      });
    }, 80);

    // وقت تحميل أطول لظهور جميل وسلس
    const timer = setTimeout(() => {
      setIsLoading(false);
      showElements();
    }, 1500); // زيادة وقت التحميل إلى 1.5 ثانية

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
      showElements();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-[9999]">
        <div className="text-center max-w-sm mx-auto px-4">
          {/* Loading Spinner - محسن */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="mb-8 flex justify-center"
          >
            <Loader2 className="w-20 h-20 text-blue-600" />
          </motion.div>

          {/* Message - محسن */}
          <div className="mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-800 mb-4"
            >
              شبابنا العالمية
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 text-lg"
            >
              جاري تحميل الموقع...
            </motion.p>
          </div>

          {/* Progress Bar - جديد */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.5 }}
            className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden mb-6"
          >
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          </motion.div>

          {/* Loading Dots - محسن */}
          <div className="flex justify-center space-x-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                className="w-4 h-4 bg-blue-500 rounded-full"
              />
            ))}
          </div>

          {/* Motivating Text - جديد */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-gray-500 text-sm"
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
