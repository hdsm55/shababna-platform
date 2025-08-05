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
  isBackendIdle?: boolean;
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
  isBackendIdle = false,
}) => {
  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <div className="flex items-center gap-2">
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
      {isBackendIdle && (
        <div className="text-center">
          <p className="text-sm text-textSecondary mb-2">
            الخادم المجاني يستيقظ من النوم
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
