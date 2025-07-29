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
    'bg-white border border-neutral-200 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm',
  elevated:
    'bg-white border border-neutral-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm',
  accent:
    'bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 hover:from-accent-100 hover:to-accent-200 transition-all duration-300 shadow-lg hover:shadow-xl',
  primary:
    'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 hover:from-primary-100 hover:to-primary-200 transition-all duration-300 shadow-lg hover:shadow-xl',
  glass:
    'bg-white/80 backdrop-blur-md border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300',
  success:
    'bg-gradient-to-br from-success-50 to-success-100 border border-success-200 hover:from-success-100 hover:to-success-200 transition-all duration-300 shadow-lg hover:shadow-xl',
  error:
    'bg-gradient-to-br from-error-50 to-error-100 border border-error-200 hover:from-error-100 hover:to-error-200 transition-all duration-300 shadow-lg hover:shadow-xl',
  warning:
    'bg-gradient-to-br from-warning-50 to-warning-100 border border-warning-200 hover:from-warning-100 hover:to-warning-200 transition-all duration-300 shadow-lg hover:shadow-xl',
  info: 'bg-gradient-to-br from-info-50 to-info-100 border border-info-200 hover:from-info-100 hover:to-info-200 transition-all duration-300 shadow-lg hover:shadow-xl',
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
  const baseClasses =
    'rounded-2xl transition-all duration-300 relative overflow-hidden';

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
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: interactive
      ? {
          y: -8,
          scale: 1.02,
          transition: { duration: 0.3, ease: 'easeOut' },
        }
      : {},
  };

  // Shimmer effect
  const ShimmerEffect = () => (
    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
  );

  return (
    <motion.div
      className={`${cardClasses} group`}
      variants={motionVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.4, ease: 'easeOut' }}
      {...props}
    >
      {/* Shimmer Effect */}
      <ShimmerEffect />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// إضافة Card Header component
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`pb-6 border-b border-neutral-200 ${className}`}>
      {children}
    </div>
  );
};

// إضافة Card Body component
export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`py-6 ${className}`}>{children}</div>;
};

// إضافة Card Footer component
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`pt-6 border-t border-neutral-200 ${className}`}>
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
    <Tag className={`text-xl font-bold text-gray-900 mb-3 ${className}`}>
      {children}
    </Tag>
  );
};

// إضافة Card Subtitle component
export const CardSubtitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
};

// إضافة Card Image component
export const CardImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  return (
    <motion.div className="relative overflow-hidden rounded-t-2xl">
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-48 object-cover ${className}`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </motion.div>
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
      className={`flex items-center gap-3 ${alignmentClasses[alignment]} ${className}`}
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
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-4 p-4 bg-gradient-to-br from-neutral-50 to-white rounded-xl hover:shadow-lg transition-all duration-300"
        >
          {item.icon && (
            <div
              className={`p-3 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 ${
                colorClasses[item.color || 'primary']
              }`}
            >
              {item.icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600">{item.label}</p>
            <p className="text-lg font-bold text-gray-900">{item.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Card;
