import React from 'react';
import { motion } from 'framer-motion';
import { tokens, hoverEffects, microInteractions } from '../../../theme/tokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'elevated'
    | 'accent'
    | 'primary'
    | 'glass'
    | 'success'
    | 'error'
    | 'warning'
    | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  gradient?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

// Card variants مع التحسينات الجديدة
const cardVariants = {
  default:
    'bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300',
  elevated:
    'bg-white border border-neutral-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
  accent:
    'bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 hover:from-accent-100 hover:to-accent-200 transition-all duration-300',
  primary:
    'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 hover:from-primary-100 hover:to-primary-200 transition-all duration-300',
  glass:
    'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300',
  success:
    'bg-gradient-to-br from-success-50 to-success-100 border border-success-200 hover:from-success-100 hover:to-success-200 transition-all duration-300',
  error:
    'bg-gradient-to-br from-error-50 to-error-100 border border-error-200 hover:from-error-100 hover:to-error-200 transition-all duration-300',
  warning:
    'bg-gradient-to-br from-warning-50 to-warning-100 border border-warning-200 hover:from-warning-100 hover:to-warning-200 transition-all duration-300',
  info: 'bg-gradient-to-br from-info-50 to-info-100 border border-info-200 hover:from-info-100 hover:to-info-200 transition-all duration-300',
};

// Card sizes مع التحسينات الجديدة
const cardSizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

// Glow effects
const glowEffects = {
  primary: 'hover:shadow-glow-primary',
  accent: 'hover:shadow-glow-accent',
  success: 'hover:shadow-glow-success',
  error: 'hover:shadow-glow-error',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  hover = false,
  interactive = false,
  gradient = false,
  glow = false,
  children,
  className = '',
  ...props
}) => {
  // تجميع classes
  const baseClasses = 'rounded-lg transition-all duration-300';

  const variantClasses = cardVariants[variant];
  const sizeClasses = cardSizes[size];
  const hoverClasses = hover ? hoverEffects.lift : '';
  const interactiveClasses = interactive ? 'cursor-pointer' : '';
  const glowClasses = glow
    ? glowEffects[variant as keyof typeof glowEffects]
    : '';
  const microClasses = interactive ? microInteractions.cardHover : '';

  const cardClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    hoverClasses,
    interactiveClasses,
    glowClasses,
    microClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Motion variants للتفاعل
  const motionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: interactive
      ? {
          y: -4,
          scale: 1.02,
          transition: { duration: 0.2 },
        }
      : {},
  };

  return (
    <motion.div
      className={cardClasses}
      variants={motionVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// إضافة Card Header component
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`pb-4 border-b border-neutral-200 ${className}`}>
      {children}
    </div>
  );
};

// إضافة Card Body component
export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`py-4 ${className}`}>{children}</div>;
};

// إضافة Card Footer component
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`pt-4 border-t border-neutral-200 ${className}`}>
      {children}
    </div>
  );
};

// إضافة Card Title component
export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}> = ({ children, className = '', level = 3 }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={`text-lg font-semibold text-neutral-900 mb-2 ${className}`}>
      {children}
    </Tag>
  );
};

// إضافة Card Subtitle component
export const CardSubtitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`text-sm text-neutral-600 ${className}`}>{children}</div>
  );
};

// إضافة Card Image component
export const CardImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={`w-full h-48 object-cover rounded-t-lg ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    />
  );
};

// إضافة Card Actions component
export const CardActions: React.FC<{
  children: React.ReactNode;
  className?: string;
  alignment?: 'left' | 'center' | 'right' | 'between';
}> = ({ children, className = '', alignment = 'right' }) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex items-center gap-2 ${alignmentClasses[alignment]} ${className}`}
    >
      {children}
    </div>
  );
};

// إضافة Card Stats component
export const CardStats: React.FC<{
  items: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: 'primary' | 'accent' | 'success' | 'error' | 'warning' | 'info';
  }>;
  className?: string;
}> = ({ items, className = '' }) => {
  const colorClasses = {
    primary: 'text-primary-600',
    accent: 'text-accent-600',
    success: 'text-success-600',
    error: 'text-error-600',
    warning: 'text-warning-600',
    info: 'text-info-600',
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3"
        >
          {item.icon && (
            <div
              className={`p-2 rounded-lg bg-neutral-100 ${
                colorClasses[item.color || 'primary']
              }`}
            >
              {item.icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-neutral-600">{item.label}</p>
            <p className="text-lg font-semibold text-neutral-900">
              {item.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Card;
