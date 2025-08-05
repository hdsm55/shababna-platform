import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
  showLogo?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'جاري تحميل الصفحة...',
  showLogo = true,
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo Animation */}
        {showLogo && (
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
            </div>
          </motion.div>
        )}

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
          <p className="text-gray-600 text-sm">{message}</p>
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
};

export default PageLoader;
