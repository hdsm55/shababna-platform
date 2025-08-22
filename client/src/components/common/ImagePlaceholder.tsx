import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Target,
  Users,
  Globe,
  TrendingUp,
  HeartHandshake,
} from 'lucide-react';

interface ImagePlaceholderProps {
  type: 'event' | 'program';
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  type,
  title,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-96',
  };

  const getGradient = () => {
    if (type === 'event') {
      return 'bg-gradient-to-br from-primary-100 via-primary-50 to-accent-100';
    } else {
      return 'bg-gradient-to-br from-accent-100 via-accent-50 to-primary-100';
    }
  };

  const getIcon = () => {
    if (type === 'event') {
      return <Calendar className="w-12 h-12 text-primary-600" />;
    } else {
      return <Target className="w-12 h-12 text-accent-600" />;
    }
  };

  const getText = () => {
    if (type === 'event') {
      return 'فعاليات شبابنا';
    } else {
      return 'البرامج';
    }
  };

  // للبرامج، استخدم الصورة الجديدة
  if (type === 'program') {
    const placeholderSrc =
      size === 'lg'
        ? '/images/program-placeholder-large.jpg'
        : '/images/program-placeholder.jpg';

    return (
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={placeholderSrc}
          alt={getText()}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
      </motion.div>
    );
  }

  // للفعاليات، استخدم التصميم الأصلي
  return (
    <motion.div
      className={`relative ${
        sizeClasses[size]
      } ${getGradient()} rounded-lg flex flex-col items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-current rounded-full"></div>
        <div className="absolute top-8 right-8 w-4 h-4 bg-current rounded-full"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 border-2 border-current transform rotate-45"></div>
        <div className="absolute bottom-4 right-4 w-3 h-3 bg-current rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {getIcon()}
        <h3 className="text-lg font-bold text-gray-800 mt-3 mb-1">
          {getText()}
        </h3>
        {title && (
          <p className="text-sm text-gray-600 max-w-xs truncate">{title}</p>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-2 right-2">
        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
      </div>
      <div className="absolute bottom-2 left-2">
        <div className="w-2 h-2 bg-white/30 rounded-full"></div>
      </div>
    </motion.div>
  );
};

export default ImagePlaceholder;
