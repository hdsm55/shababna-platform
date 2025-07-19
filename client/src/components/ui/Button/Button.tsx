import React from 'react';
import { getButtonClasses } from '../../common/DesignSystem';
import { DESIGN_SYSTEM } from '../../common/DesignSystem';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  dir?: 'rtl' | 'ltr';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      fullWidth = false,
      dir,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const direction =
      dir ||
      (typeof document !== 'undefined'
        ? (document.documentElement.dir as 'rtl' | 'ltr')
        : 'rtl');
    const isRtl = direction === 'rtl';

    // Sizing system from DesignSystem
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center font-medium',
          `rounded-lg`,
          `transition-all focus:outline-none focus:ring-2 focus:ring-[${DESIGN_SYSTEM.colors.primary}] focus:ring-offset-2`,
          'disabled:opacity-60 disabled:cursor-not-allowed',
          getButtonClasses(variant),
          sizeClasses[size],
          widthClass,
          className,
        ].join(' ')}
        disabled={disabled || loading}
        dir={direction}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        aria-pressed={props['aria-pressed']}
        aria-label={props['aria-label'] || undefined}
        // إضافة خصائص aria للوصولية
        {...props}
      >
        {loading ? (
          <span className={isRtl ? 'ml-2' : 'mr-2'}>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : icon ? (
          <span className={isRtl ? 'pl-2' : 'pr-2'}>{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
