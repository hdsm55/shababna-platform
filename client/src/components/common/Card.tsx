import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { getCardClasses } from './DesignSystem';

export type CardVariant =
  | 'default'
  | 'elevated'
  | 'accent'
  | 'primary'
  | 'interactive'
  | 'glass';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onClick?: () => void;
}

const paddingStyles: Record<CardProps['padding'], string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className,
  hover = false,
  padding = 'md',
  interactive = false,
  onClick,
  ...props
}) => {
  const baseClasses = clsx(
    getCardClasses(variant),
    paddingStyles[padding],
    interactive && 'cursor-pointer',
    hover && 'hover:shadow-lg hover:-translate-y-1',
    className
  );

  if (interactive || onClick) {
    const MotionCard = motion.div;
    return (
      <MotionCard
        className={baseClasses}
        onClick={onClick}
        whileHover={interactive ? { y: -2, scale: 1.02 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </MotionCard>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
