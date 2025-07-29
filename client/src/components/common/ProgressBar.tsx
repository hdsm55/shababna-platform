import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label = 'التقدم',
  showPercentage = true,
  className = '',
  color = 'primary',
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'accent':
        return 'from-accent-500 to-accent-600';
      case 'success':
        return 'from-green-500 to-green-600';
      case 'warning':
        return 'from-yellow-500 to-yellow-600';
      case 'error':
        return 'from-red-500 to-red-600';
      default:
        return 'from-primary-500 to-primary-600';
    }
  };

  const getStatusIcon = (progress: number) => {
    if (progress >= 100) return '🎉';
    if (progress >= 80) return '🚀';
    if (progress >= 60) return '⚡';
    if (progress >= 40) return '📈';
    if (progress >= 20) return '🔄';
    return '⏳';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        {showPercentage && (
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-gray-700">{progress}%</span>
            <span className="text-lg">{getStatusIcon(progress)}</span>
          </div>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className={`bg-gradient-to-r ${getColorClasses(
            color
          )} h-2.5 rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* تأثير التوهج */}
          <motion.div
            className="absolute inset-0 bg-white opacity-20 rounded-full"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>

      {/* رسائل التحفيز */}
      {progress > 0 && progress < 100 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500 mt-1"
        >
          {progress < 25 && 'ابدأ بملء الحقول الأساسية'}
          {progress >= 25 && progress < 50 && 'أحسنت! استمر في التقدم'}
          {progress >= 50 && progress < 75 && 'أداء ممتاز! اقتربت من النهاية'}
          {progress >= 75 && progress < 100 && 'تقريباً انتهيت! خطوة أخيرة'}
        </motion.p>
      )}
    </motion.div>
  );
};

export default ProgressBar;
