import React from 'react';
import { theme } from '@/theme';
import { motion } from 'framer-motion';

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
      dir || (document?.documentElement?.dir as 'rtl' | 'ltr') || 'rtl';
    const isRtl = direction === 'rtl';

    const baseStyles = `
      inline-flex items-center justify-center
      font-medium rounded-lg transition-all
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed
      ${theme.fontFamily.arabic}
    `;

    const variants = {
      primary: `
        bg-primary-500 text-white
        hover:bg-primary-600 active:bg-primary-700
        focus:ring-primary-500
      `,
      secondary: `
        bg-accent-500 text-white
        hover:bg-accent-600 active:bg-accent-700
        focus:ring-accent-500
      `,
      outline: `
        border-2 border-primary-500 text-primary-500
        hover:bg-primary-50 active:bg-primary-100
        focus:ring-primary-500
      `,
      ghost: `
        text-primary-500
        hover:bg-primary-50 active:bg-primary-100
        focus:ring-primary-500
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const iconSpacing = icon ? (isRtl ? 'pl-2' : 'pr-2') : '';
    const widthClass = fullWidth ? 'w-full' : '';

    const buttonContent = (
      <>
        {loading ? (
          <span className="animate-spin mr-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span className={iconSpacing}>{icon}</span>
        ) : null}
        {children}
      </>
    );

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${widthClass}
          ${className}
        `}
        disabled={disabled || loading}
        dir={direction}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
