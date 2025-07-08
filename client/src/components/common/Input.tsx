import React from 'react';
import clsx from 'clsx';

/**
 * Modern Input component inspired by Stripe/Linear design
 * Features smooth focus states, consistent spacing, and modern styling
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ElementType;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon: Icon, fullWidth = false, className, ...props },
    ref
  ) => {
    return (
      <div className={clsx('mb-4', fullWidth && 'w-full')}>
        {label && (
          <label className="block mb-1 text-sm font-medium text-textPrimary rtl:text-right">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto rtl:mr-0 rtl:ml-0 text-secondary pointer-events-none">
              <Icon className="w-5 h-5" />
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              'block w-full rounded-md border bg-surface text-textPrimary placeholder:text-textSecondary focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150',
              'py-2 px-3',
              Icon && 'pl-10 rtl:pr-10 rtl:pl-3',
              error && 'border-error focus:ring-error focus:border-error',
              !error && 'border-secondary',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <div className="mt-1 text-xs text-error font-medium rtl:text-right">
            {error}
          </div>
        )}
      </div>
    );
  }
);

export default Input;
