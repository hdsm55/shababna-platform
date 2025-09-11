import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

/**
 * Enhanced LoadingSpinner component with modern design and smooth animations
 * Features multiple variants, accessibility, and responsive design
 */
interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'brand';
  text?: string;
  className?: string;
  isBackendIdle?: boolean;
  showProgress?: boolean;
  progress?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

const sizeMap = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const colorMap = {
  primary: 'border-primary-500',
  secondary: 'border-secondary-500',
  accent: 'border-accent-500',
  neutral: 'border-neutral-500',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className,
  isBackendIdle = false,
  showProgress = false,
  progress = 0,
  color = 'primary',
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner size={size} color={color} />;
      case 'pulse':
        return <PulseSpinner size={size} color={color} />;
      case 'bars':
        return <BarsSpinner size={size} color={color} />;
      case 'brand':
        return <BrandSpinner size={size} />;
      default:
        return <DefaultSpinner size={size} color={color} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={clsx('flex flex-col items-center gap-4', className)}
    >
      {/* Main Spinner */}
      <div className="flex items-center gap-3">
        {renderSpinner()}
        {text && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-dark-600 text-sm font-medium rtl:text-right"
          >
            {text}
          </motion.span>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && progress > 0 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          className="w-32 h-1 bg-neutral-200 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {/* Backend Idle State */}
      {isBackendIdle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-neutral-600 mb-3 font-medium">
            الخادم المجاني يستيقظ من النوم
          </p>
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Default Spinner - Classic rotating circle
const DefaultSpinner: React.FC<{ size: string; color: string }> = ({
  size,
  color,
}) => (
  <motion.div
    className={clsx(
      'rounded-full border-2 border-t-transparent',
      sizeMap[size as keyof typeof sizeMap],
      colorMap[color as keyof typeof colorMap]
    )}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    role="status"
    aria-label="Loading"
  />
);

// Dots Spinner - Three bouncing dots
const DotsSpinner: React.FC<{ size: string; color: string }> = ({
  size,
  color,
}) => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={clsx(
          'rounded-full',
          size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
          color === 'primary'
            ? 'bg-primary-500'
            : color === 'secondary'
            ? 'bg-secondary-500'
            : color === 'accent'
            ? 'bg-accent-500'
            : 'bg-neutral-500'
        )}
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

// Pulse Spinner - Pulsing circle
const PulseSpinner: React.FC<{ size: string; color: string }> = ({
  size,
  color,
}) => (
  <motion.div
    className={clsx(
      'rounded-full',
      sizeMap[size as keyof typeof sizeMap],
      color === 'primary'
        ? 'bg-primary-500'
        : color === 'secondary'
        ? 'bg-secondary-500'
        : color === 'accent'
        ? 'bg-accent-500'
        : 'bg-neutral-500'
    )}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
    }}
  />
);

// Bars Spinner - Three vertical bars
const BarsSpinner: React.FC<{ size: string; color: string }> = ({
  size,
  color,
}) => (
  <div className="flex items-end gap-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={clsx(
          'rounded-sm',
          size === 'xs' ? 'w-1' : size === 'sm' ? 'w-1.5' : 'w-2',
          size === 'xs' ? 'h-3' : size === 'sm' ? 'h-4' : 'h-6',
          color === 'primary'
            ? 'bg-primary-500'
            : color === 'secondary'
            ? 'bg-secondary-500'
            : color === 'accent'
            ? 'bg-accent-500'
            : 'bg-neutral-500'
        )}
        animate={{
          height: [
            size === 'xs' ? 'h-3' : size === 'sm' ? 'h-4' : 'h-6',
            size === 'xs' ? 'h-1' : size === 'sm' ? 'h-2' : 'h-3',
            size === 'xs' ? 'h-3' : size === 'sm' ? 'h-4' : 'h-6',
          ],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

// Brand Spinner - Custom brand design
const BrandSpinner: React.FC<{ size: string }> = ({ size }) => (
  <motion.div
    className={clsx(
      'relative rounded-full bg-gradient-to-br from-primary-500 to-secondary-500',
      sizeMap[size as keyof typeof sizeMap]
    )}
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
  >
    <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
      <motion.div
        className="text-primary-600 font-bold text-xs"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        شبابنا
      </motion.div>
    </div>
  </motion.div>
);

export default LoadingSpinner;
