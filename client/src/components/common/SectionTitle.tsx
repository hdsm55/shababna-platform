import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern SectionTitle component inspired by Stripe/Linear design
 * Features smooth animations, consistent spacing, and modern styling
 */
interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'centered' | 'with-subtitle' | 'gradient';
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUnderline?: boolean;
  underlineColor?: 'primary' | 'accent' | 'gradient' | 'purple' | 'emerald';
  badge?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className = '',
  variant = 'default',
  subtitle,
  size = 'md',
  showUnderline = true,
  underlineColor = 'primary',
  badge,
}) => {
  const sizeClasses = {
    sm: 'text-lg md:text-xl',
    md: 'text-xl md:text-2xl lg:text-3xl',
    lg: 'text-2xl md:text-3xl lg:text-4xl',
    xl: 'text-3xl md:text-4xl lg:text-5xl',
  };

  const variantClasses = {
    default: 'text-left',
    centered: 'text-center',
    'with-subtitle': 'text-left',
    gradient: 'text-center',
  };

  const underlineClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600',
    gradient: 'bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
  };

  const titleClasses =
    variant === 'gradient' ? 'gradient-text' : 'text-neutral-900';

  return (
    <motion.div
      className={`space-y-6 ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 shadow-sm ${
            variant === 'centered' || variant === 'gradient' ? 'mx-auto' : ''
          }`}
        >
          {badge}
        </motion.div>
      )}

      <h2
        className={`${sizeClasses[size]} font-bold ${titleClasses} leading-tight tracking-tight`}
      >
        {children}
        {showUnderline && (
          <motion.div
            className={`h-1 w-20 mt-6 rounded-full shadow-sm ${
              underlineClasses[underlineColor]
            } ${
              variant === 'centered' || variant === 'gradient' ? 'mx-auto' : ''
            }`}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: '5rem', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        )}
      </h2>
      {subtitle && (
        <motion.p
          className="text-lg text-neutral-600 max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
