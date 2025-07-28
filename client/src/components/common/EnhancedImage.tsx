import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImagePlaceholder from './ImagePlaceholder';

interface EnhancedImageProps {
  src?: string;
  alt: string;
  type: 'event' | 'program';
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  type,
  title,
  className = '',
  size = 'md',
  fallback,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-96',
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
    return (
      <ImagePlaceholder
        type={type}
        title={title}
        className={className}
        size={size}
      />
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

export default EnhancedImage;
