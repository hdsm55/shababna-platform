import React from 'react';
import { motion } from 'framer-motion';
import { designTokens, componentStyles } from '../../../theme/designTokens';

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

// Button variants محسنة ومتناسقة
const buttonVariants = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300',
  secondary:
    'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300',
  accent:
    'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-300',
  ghost:
    'bg-transparent text-blue-600 hover:bg-blue-50 transition-all duration-200',
  outline:
    'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200',
  success:
    'bg-success-500 text-white hover:bg-success-600 shadow-md hover:shadow-lg transition-all duration-300',
  error:
    'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-300',
  warning:
    'bg-yellow-600 text-white hover:bg-yellow-700 shadow-md hover:shadow-lg transition-all duration-300',
  info: 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-300',
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
  const glowClasses = glow ? 'shadow-lg' : '';

  const buttonClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    roundedClasses,
    glowClasses,
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
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
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
    </button>
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
