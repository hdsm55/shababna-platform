import React from 'react';
import clsx from 'clsx';

/**
 * Modern LoadingSpinner component inspired by Stripe/Linear design
 * Features smooth animations, consistent spacing, and modern styling
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
}) => {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <span
        className={clsx(
          'inline-block animate-spin rounded-full border-2 border-primary border-t-transparent',
          sizeMap[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="text-textSecondary text-sm rtl:text-right">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
