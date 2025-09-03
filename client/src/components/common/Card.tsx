import React from 'react';
import clsx from 'clsx';

export type CardVariant = 'base' | 'accent' | 'elevated';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  base: 'bg-surface text-textPrimary shadow-secondary-sm',
  accent:
    'bg-primary/10 text-primary border border-primary/20 shadow-accent-sm',
  elevated: 'bg-surface text-textPrimary shadow-secondary-lg',
};

const paddingStyles: Record<CardProps['padding'], string> = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

const Card: React.FC<CardProps> = ({
  variant = 'base',
  children,
  className,
  hover = false,
  padding = 'none',
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-lg transition-shadow duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'hover:shadow-secondary-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
