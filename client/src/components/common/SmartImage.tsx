import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SmartImageProps {
  src?: string;
  alt: string;
  type: 'event' | 'program' | 'blog';
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  type,
  title,
  className = '',
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-96',
  };

  const getPlaceholderSrc = () => {
    if (type === 'event') {
      return '/images/events-default.jpg';
    } else if (type === 'blog') {
      return '/images/blog-logo.jpg';
    } else {
      return '/images/programs-default.jpg';
    }
  };

  const getFallbackSrc = () => {
    return '/images/fallback.svg';
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // إذا لم توجد صورة أو حدث خطأ، اعرض placeholder
  if (!src || hasError) {
    const placeholderSrc = getPlaceholderSrc();
    console.log(
      `🔍 SmartImage: Using placeholder for ${type}:`,
      placeholderSrc
    );

    return (
      <motion.div
        className={`relative overflow-hidden rounded-lg ${sizeClasses[size]} ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={placeholderSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(
              `❌ SmartImage: Failed to load placeholder for ${type}:`,
              placeholderSrc
            );
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
      </motion.div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${sizeClasses[size]} ${className}`}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </motion.div>
      )}

      {/* Image */}
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};

export default SmartImage;
