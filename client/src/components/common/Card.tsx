import React from 'react';
import clsx from 'clsx';

export type CardVariant = 'base' | 'accent' | 'elevated';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  base: 'bg-surface text-textPrimary shadow-sm',
  accent: 'bg-primary/10 text-primary border border-primary/20',
  elevated: 'bg-surface text-textPrimary shadow-lg',
};

const Card: React.FC<CardProps> = ({
  variant = 'base',
  children,
  className,
  hover = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-lg p-lg transition-shadow duration-200',
        variantStyles[variant],
        hover && 'hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
