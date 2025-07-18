import React from 'react';
import { theme } from './theme';
import { motion } from 'framer-motion';

export type CardVariant = 'base' | 'hoverable' | 'elevated';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  dir?: 'rtl' | 'ltr';
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'base', dir, className = '', children, ...props }, ref) => {
    const direction =
      dir || (document?.documentElement?.dir as 'rtl' | 'ltr') || 'rtl';

    const base = `bg-neutral text-dark rounded-lg p-6 shadow-sm ${theme.fontFamily.arabic}`;
    const variants: Record<CardVariant, string> = {
      base: '',
      hoverable:
        'transition-transform duration-200 hover:shadow-lg hover:-translate-y-1',
      elevated: 'shadow-lg',
    };

    const classes = [
      base,
      variants[variant],
      direction === 'rtl' ? 'text-right' : 'text-left',
      className,
    ].join(' ');

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'block' }}
      >
        <div ref={ref} dir={direction} className={classes} {...props}>
          {children}
        </div>
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
