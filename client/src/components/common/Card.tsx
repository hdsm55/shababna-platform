import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern Card component inspired by Stripe/Linear design
 * Features smooth hover effects, consistent spacing, and modern styling
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  gradient = false,
  variant = 'default',
  onClick,
  padding = 'md',
  border = true,
  shadow = 'sm',
}) => {
  const baseClasses =
    'bg-white rounded-xl overflow-hidden transition-all duration-300 relative group';

  const variantClasses = {
    default: 'border border-neutral-200',
    elevated: 'border border-neutral-200',
    outlined: 'border-2 border-neutral-200',
    glass: 'bg-white/80 backdrop-blur-md border border-white/20',
    gradient:
      'bg-gradient-to-br from-white to-neutral-50 border border-neutral-200',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-card',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const gradientClasses = gradient
    ? 'bg-gradient-to-br from-primary-50 via-white to-accent-50'
    : '';

  const hoverClasses = hover
    ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer hover:border-primary-200'
    : '';

  const clickableClasses = onClick ? 'cursor-pointer' : '';
  const borderClass = border ? '' : 'border-0';

  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow:
                '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            }
          : {}
      }
      whileTap={hover ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variantClasses[variant]} ${shadowClasses[shadow]} ${gradientClasses} ${hoverClasses} ${clickableClasses} ${borderClass} ${className}`}
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      {hover && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}

      {/* Shimmer effect for gradient cards */}
      {gradient && hover && (
        <motion.div
          className="absolute inset-0 bg-gradient-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 1 }}
        />
      )}

      {/* Subtle glow effect for elevated cards */}
      {variant === 'elevated' && hover && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          }}
        />
      )}

      <div className={`${paddingClasses[padding]} relative z-10`}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
