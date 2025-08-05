import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'جاري تحميل الصفحة...',
}) => {
  useEffect(() => {
    // إخفاء الفوتر أثناء التحميل
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }

    // إخفاء الهيدر أيضاً لتجنب التداخل
    const header = document.querySelector('header');
    if (header) {
      header.style.zIndex = '1';
    }

    return () => {
      // إعادة إظهار الفوتر بعد انتهاء التحميل
      if (footer) {
        footer.style.display = '';
      }
      if (header) {
        header.style.zIndex = '';
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center z-[9999] pointer-events-auto">
      <div className="text-center max-w-sm mx-auto px-4">
        {/* Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          className="mb-6 flex justify-center"
        >
          <Loader2 className="w-16 h-16 text-blue-600" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-700 text-lg font-medium">{message}</p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              className="w-3 h-3 bg-blue-500 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PageLoader;
