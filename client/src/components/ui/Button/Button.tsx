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

// Button variants مع التحسينات الجديدة والألوان الغامقة
const buttonVariants = {
  primary:
    'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-primary-500',
  secondary:
    'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-secondary-500',
  accent:
    'bg-gradient-to-r from-accent-600 to-accent-700 text-white hover:from-accent-700 hover:to-accent-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-accent-500',
  ghost:
    'bg-transparent text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200',
  outline:
    'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700 transition-all duration-200',
  success:
    'bg-gradient-to-r from-success-600 to-success-700 text-white hover:from-success-700 hover:to-success-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-success-500',
  error:
    'bg-gradient-to-r from-error-600 to-error-700 text-white hover:from-error-700 hover:to-error-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-error-500',
  warning:
    'bg-gradient-to-r from-warning-600 to-warning-700 text-white hover:from-warning-700 hover:to-warning-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-warning-500',
  info: 'bg-gradient-to-r from-info-600 to-info-700 text-white hover:from-info-700 hover:to-info-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-info-500',
};

// Button sizes مع التحسينات الجديدة
const buttonSizes = {
  xs: 'px-2 py-1 text-xs font-medium',
  sm: 'px-3 py-1.5 text-sm font-medium',
  md: 'px-4 py-2 text-base font-medium',
  lg: 'px-6 py-3 text-lg font-medium',
  xl: 'px-8 py-4 text-xl font-medium',
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
    'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];
  const widthClasses = fullWidth ? 'w-full' : '';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg';
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
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
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
          ? 'mr-2 rtl:ml-2 rtl:mr-0'
          : 'ml-2 rtl:mr-2 rtl:ml-0'
      }`}
    >
      {children}
    </motion.div>
  );

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span className="ml-2">{children}</span>
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
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
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
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
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
