import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Modern Input component inspired by Stripe/Linear design
 * Features smooth focus states, consistent spacing, and modern styling
 */
interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  className?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  className = '',
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  helperText,
  ...props
}) => {
  const baseClasses =
    'w-full rounded-lg border bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-300 shadow-sm';

  const variantClasses = {
    default:
      'border-neutral-300 focus:border-primary-500 focus:ring-primary-500 hover:border-neutral-400',
    filled:
      'border-neutral-300 bg-neutral-50 focus:border-primary-500 focus:ring-primary-500 focus:bg-white hover:border-neutral-400',
    outlined:
      'border-2 border-neutral-300 focus:border-primary-500 focus:ring-primary-500 hover:border-neutral-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-4 py-4 text-lg',
  };

  const stateClasses = error
    ? 'border-error-500 focus:border-error-500 focus:ring-error-500 hover:border-error-600'
    : success
    ? 'border-success-500 focus:border-success-500 focus:ring-success-500 hover:border-success-600'
    : variantClasses[variant];

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSpacing = {
    sm: 'px-3',
    md: 'px-4',
    lg: 'px-4',
  };

  const hasIcon = Icon !== undefined;
  const inputPadding = hasIcon
    ? iconPosition === 'left'
      ? `${iconSpacing[size]} pl-10`
      : `${iconSpacing[size]} pr-10`
    : iconSpacing[size];

  return (
    <div className={`space-y-2 ${className}`} dir={props.dir || 'auto'}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className={`${iconClasses[size]} text-neutral-400 group-focus-within:text-primary-500 transition-colors duration-300`}
            />
          </div>
        )}
        <input
          {...props}
          className={`${baseClasses} ${stateClasses} ${sizeClasses[size]} ${inputPadding}`}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon
              className={`${iconClasses[size]} text-neutral-400 group-focus-within:text-primary-500 transition-colors duration-300`}
            />
          </div>
        )}

        {/* Status Icons */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <AlertCircle className="w-5 h-5 text-error-500" />
          </motion.div>
        )}
        {success && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <CheckCircle className="w-5 h-5 text-success-500" />
          </motion.div>
        )}

        {/* Focus ring effect */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
          style={{
            background: error
              ? 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)'
              : success
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          }}
        />
      </div>
      {(error || success || helperText) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          {error && (
            <p className="text-sm text-error-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0 flex-shrink-0" />
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-sm text-success-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0 flex-shrink-0" />
              {success}
            </p>
          )}
          {helperText && !error && !success && (
            <p className="text-sm text-neutral-500">{helperText}</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Input;
