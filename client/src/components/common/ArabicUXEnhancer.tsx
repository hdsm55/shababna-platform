import React from 'react';
import { motion } from 'framer-motion';

// Arabic UX Enhancement Components

// RTL-aware container
interface RTLContainerProps {
  children: React.ReactNode;
  className?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
}

export const RTLContainer: React.FC<RTLContainerProps> = ({
  children,
  className = '',
  dir = 'auto',
}) => {
  return (
    <div
      className={`${className}`}
      dir={dir}
      style={{
        textAlign: dir === 'rtl' ? 'right' : dir === 'ltr' ? 'left' : 'auto',
        direction: dir === 'auto' ? 'inherit' : dir,
      }}
    >
      {children}
    </div>
  );
};

// Arabic-optimized text component
interface ArabicTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  dir?: 'rtl' | 'ltr' | 'auto';
}

export const ArabicText: React.FC<ArabicTextProps> = ({
  children,
  className = '',
  size = 'base',
  weight = 'normal',
  dir = 'auto',
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const classes = `${sizeClasses[size]} ${weightClasses[weight]} ${className}`;

  return (
    <span
      className={classes}
      dir={dir}
      style={{
        fontFamily:
          dir === 'rtl'
            ? 'Tajawal, Noto Sans Arabic, system-ui, sans-serif'
            : 'inherit',
        lineHeight: dir === 'rtl' ? '1.8' : 'inherit',
      }}
    >
      {children}
    </span>
  );
};

// Arabic-optimized button
interface ArabicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  dir?: 'rtl' | 'ltr';
}

export const ArabicButton: React.FC<ArabicButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'start',
  dir = 'rtl',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary:
      'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500',
    outline:
      'border border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500',
    ghost: 'text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const isRTL = dir === 'rtl';
  const iconMargin = isRTL
    ? iconPosition === 'start'
      ? 'ml'
      : 'mr'
    : iconPosition === 'start'
    ? 'mr'
    : 'ml';

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      dir={dir}
      style={{
        fontFamily: isRTL
          ? 'Tajawal, Noto Sans Arabic, system-ui, sans-serif'
          : 'inherit',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading && (
        <div
          className={`animate-spin rounded-full h-4 w-4 border-b-2 border-current ${
            isRTL ? 'ml-2' : 'mr-2'
          }`}
        />
      )}

      {icon && iconPosition === 'start' && !loading && (
        <span className={`${iconMargin}-2`}>{icon}</span>
      )}

      {children}

      {icon && iconPosition === 'end' && !loading && (
        <span className={`${iconMargin}-2`}>{icon}</span>
      )}
    </motion.button>
  );
};

// Arabic-optimized input
interface ArabicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  dir?: 'rtl' | 'ltr';
}

export const ArabicInput: React.FC<ArabicInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  dir = 'rtl',
  className = '',
  ...props
}) => {
  const isRTL = dir === 'rtl';
  const inputClasses = `w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
    error
      ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
      : 'border-secondary-300'
  } ${leftIcon ? (isRTL ? 'pr-10' : 'pl-10') : ''} ${
    rightIcon ? (isRTL ? 'pl-10' : 'pr-10') : ''
  } ${className}`;

  return (
    <div className="space-y-1" dir={dir}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div
            className={`absolute inset-y-0 ${
              isRTL ? 'right-0 pr-3' : 'left-0 pl-3'
            } flex items-center pointer-events-none`}
          >
            <span className="text-secondary-400">{leftIcon}</span>
          </div>
        )}

        <input
          className={inputClasses}
          dir={dir}
          style={{
            fontFamily: isRTL
              ? 'Tajawal, Noto Sans Arabic, system-ui, sans-serif'
              : 'inherit',
            textAlign: isRTL ? 'right' : 'left',
          }}
          {...props}
        />

        {rightIcon && (
          <div
            className={`absolute inset-y-0 ${
              isRTL ? 'left-0 pl-3' : 'right-0 pr-3'
            } flex items-center pointer-events-none`}
          >
            <span className="text-secondary-400">{rightIcon}</span>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-error-600">{error}</p>}

      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
};

// Arabic-optimized card
interface ArabicCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  dir?: 'rtl' | 'ltr';
}

export const ArabicCard: React.FC<ArabicCardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  dir = 'rtl',
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const classes = `bg-white rounded-xl border border-secondary-200 ${
    paddingClasses[padding]
  } ${shadowClasses[shadow]} ${
    hover ? 'hover:shadow-lg transition-shadow duration-200' : ''
  } ${className}`;

  return (
    <motion.div
      className={classes}
      dir={dir}
      style={{
        fontFamily:
          dir === 'rtl'
            ? 'Tajawal, Noto Sans Arabic, system-ui, sans-serif'
            : 'inherit',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Arabic number formatter
export const formatArabicNumber = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
};

// Arabic date formatter
export const formatArabicDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };

  return new Intl.DateTimeFormat('ar-SA', options).format(date);
};

export default {
  RTLContainer,
  ArabicText,
  ArabicButton,
  ArabicInput,
  ArabicCard,
  formatArabicNumber,
  formatArabicDate,
};
