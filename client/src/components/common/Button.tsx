import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

/**
 * Modern Button component inspired by Stripe/Linear design
 * Features smooth animations, consistent spacing, and modern styling
 */
interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'gradient'
    | 'accent'
    | 'success'
    | 'error'
    | 'purple'
    | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

  const variantClasses = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md active:bg-primary-800 hover:-translate-y-0.5 hover:shadow-lg',
    secondary:
      'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 border border-accent-500 shadow-sm hover:shadow-md active:bg-accent-700 hover:-translate-y-0.5 hover:shadow-lg',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-white shadow-sm hover:shadow-md active:bg-primary-100 hover:-translate-y-0.5 hover:shadow-lg',
    ghost:
      'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100 hover:-translate-y-0.5',
    gradient:
      'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-sm hover:shadow-md active:from-primary-800 active:to-primary-900 hover:-translate-y-0.5 hover:shadow-lg',
    accent:
      'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-sm hover:shadow-md active:bg-accent-700 hover:-translate-y-0.5 hover:shadow-lg',
    success:
      'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-sm hover:shadow-md active:bg-success-700 hover:-translate-y-0.5 hover:shadow-lg',
    error:
      'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 shadow-sm hover:shadow-md active:bg-error-700 hover:-translate-y-0.5 hover:shadow-lg',
    purple:
      'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500 shadow-sm hover:shadow-md active:bg-purple-700 hover:-translate-y-0.5 hover:shadow-lg',
    emerald:
      'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-sm hover:shadow-md active:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-1.5 min-h-[32px]',
    md: 'px-4 py-2.5 text-sm gap-2 min-h-[40px]',
    lg: 'px-6 py-3 text-base gap-2 min-h-[48px]',
    xl: 'px-8 py-4 text-lg gap-3 min-h-[56px]',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={{
        scale: disabled || loading ? 1 : 1.02,
      }}
      whileTap={{
        scale: disabled || loading ? 1 : 0.98,
      }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {/* Loading overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg"
        >
          <LoadingSpinner size="sm" color="text-current" />
        </motion.div>
      )}

      {/* Shimmer effect for gradient buttons */}
      {variant === 'gradient' && !loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Glow effect for primary and accent buttons */}
      {(variant === 'primary' || variant === 'accent') && !loading && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              variant === 'primary'
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Content */}
      <div
        className={`flex items-center ${
          loading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-200 relative z-10`}
      >
        {!loading && Icon && iconPosition === 'left' && (
          <Icon
            className={`${iconSizeClasses[size]} ${
              children ? 'mr-2 rtl:ml-2 rtl:mr-0' : ''
            } transition-transform group-hover:scale-110`}
          />
        )}
        {!loading && children}
        {!loading && Icon && iconPosition === 'right' && (
          <Icon
            className={`${iconSizeClasses[size]} ${
              children ? 'ml-2 rtl:mr-2 rtl:ml-0' : ''
            } transition-transform group-hover:scale-110`}
          />
        )}
      </div>
    </motion.button>
  );
};

export default Button;
