import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern LoadingSpinner component inspired by Stripe/Linear design
 * Features smooth animations, consistent spacing, and modern styling
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'ring';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-primary-500',
  variant = 'default',
  className = '',
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 ${color} bg-current rounded-full shadow-sm`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
        {text && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ml-3 ${textSizeClasses[size]} text-neutral-600 font-medium`}
          >
            {text}
          </motion.span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} ${color} bg-current rounded-full shadow-lg`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {text && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ml-3 ${textSizeClasses[size]} text-neutral-600 font-medium`}
          >
            {text}
          </motion.span>
        )}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`w-1 ${color} bg-current rounded-full shadow-sm`}
            animate={{
              height: ['1rem', '2.5rem', '1rem'],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
        {text && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ml-3 ${textSizeClasses[size]} text-neutral-600 font-medium`}
          >
            {text}
          </motion.span>
        )}
      </div>
    );
  }

  if (variant === 'ring') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          <motion.div
            className={`${sizeClasses[size]} ${color} border-2 border-current border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className={`${sizeClasses[size]} absolute inset-0 ${color} border-2 border-current border-r-transparent rounded-full`}
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
        {text && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`ml-3 ${textSizeClasses[size]} text-neutral-600 font-medium`}
          >
            {text}
          </motion.span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} ${color} border-2 border-current border-t-transparent rounded-full shadow-sm`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className={`${sizeClasses[size]} absolute inset-0 ${color} border-2 border-current border-r-transparent rounded-full opacity-30`}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {/* Glow effect */}
        <motion.div
          className={`${sizeClasses[size]} absolute inset-0 ${color} rounded-full opacity-20 blur-sm`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      {text && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`ml-3 ${textSizeClasses[size]} text-neutral-600 font-medium`}
        >
          {text}
        </motion.span>
      )}
    </div>
  );
};

export default LoadingSpinner;
