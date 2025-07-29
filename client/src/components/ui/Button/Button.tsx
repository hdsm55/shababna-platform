import React from 'react';
import { motion } from 'framer-motion';
import { tokens, hoverEffects, microInteractions } from '../../../theme/tokens';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ghost'
    | 'outline'
    | 'success'
    | 'error'
    | 'warning'
    | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
  gradient?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

// Button variants مع التحسينات الجديدة والألوان الجديدة
const buttonVariants = {
  primary:
    'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-primary-400 hover:border-primary-500',
  secondary:
    'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-secondary-400 hover:border-secondary-500',
  accent:
    'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-accent-400 hover:border-accent-500',
  ghost:
    'bg-transparent text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 hover:shadow-lg',
  outline:
    'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700 transition-all duration-200 hover:shadow-lg',
  success:
    'bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-success-400 hover:border-success-500',
  error:
    'bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-error-400 hover:border-error-500',
  warning:
    'bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-warning-400 hover:border-warning-500',
  info: 'bg-gradient-to-r from-info-500 to-info-600 hover:from-info-600 hover:to-info-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-info-400 hover:border-info-500',
};

// Button sizes مع التحسينات الجديدة
const buttonSizes = {
  xs: 'px-3 py-1.5 text-xs font-semibold',
  sm: 'px-4 py-2 text-sm font-semibold',
  md: 'px-6 py-3 text-base font-semibold',
  lg: 'px-8 py-4 text-lg font-semibold',
  xl: 'px-10 py-5 text-xl font-semibold',
};

// Glow effects
const glowEffects = {
  primary: 'hover:shadow-glow-primary',
  accent: 'hover:shadow-glow-accent',
  success: 'hover:shadow-glow-success',
  error: 'hover:shadow-glow-error',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  gradient = false,
  glow = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // تجميع classes
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];
  const widthClasses = fullWidth ? 'w-full' : '';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-xl';
  const glowClasses = glow
    ? glowEffects[variant as keyof typeof glowEffects]
    : '';
  const microClasses = microInteractions.buttonPress;

  const buttonClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    roundedClasses,
    glowClasses,
    microClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
    />
  );

  // Icon wrapper with animation
  const IconWrapper = ({
    children,
    position,
  }: {
    children: React.ReactNode;
    position: 'left' | 'right';
  }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center ${
        position === 'left'
          ? 'mr-3 rtl:ml-3 rtl:mr-0'
          : 'ml-3 rtl:mr-3 rtl:ml-0'
      }`}
    >
      {children}
    </motion.div>
  );

  // Shimmer effect
  const ShimmerEffect = () => (
    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
  );

  return (
    <motion.button
      className={`${buttonClasses} group`}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Shimmer Effect */}
      <ShimmerEffect />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center">
        {loading ? (
          <>
            <LoadingSpinner />
            <span className="ml-3">{children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <IconWrapper position="left">{icon}</IconWrapper>
            )}
            <span className="flex-1 text-center">{children}</span>
            {icon && iconPosition === 'right' && (
              <IconWrapper position="right">{icon}</IconWrapper>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
};

// إضافة Button Group component
export const ButtonGroup: React.FC<{
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
}> = ({ children, orientation = 'horizontal', spacing = 'md' }) => {
  const orientationClasses =
    orientation === 'vertical' ? 'flex-col' : 'flex-row';
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  return (
    <div className={`flex ${orientationClasses} ${spacingClasses[spacing]}`}>
      {children}
    </div>
  );
};

// إضافة Icon Button component
export const IconButton: React.FC<
  Omit<ButtonProps, 'children'> & {
    icon: React.ReactNode;
    label?: string;
  }
> = ({ icon, label, size = 'md', ...props }) => {
  const iconSizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  };

  return (
    <Button
      {...props}
      size={size}
      className={`p-0 ${iconSizes[size]} ${props.className || ''}`}
      aria-label={label}
    >
      {icon}
    </Button>
  );
};

export default Button;
