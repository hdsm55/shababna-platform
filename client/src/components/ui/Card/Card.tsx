import React from 'react';
import { theme } from '@/theme';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'hoverable' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  dir?: 'rtl' | 'ltr';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'base',
      padding = 'md',
      dir,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const direction =
      dir || (document?.documentElement?.dir as 'rtl' | 'ltr') || 'rtl';
    const isRtl = direction === 'rtl';

    const baseStyles = `
      bg-white rounded-lg
      ${theme.fontFamily.arabic}
    `;

    const variants = {
      base: 'border border-neutral-200',
      hoverable: `
        border border-neutral-200
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-1
      `,
      elevated: 'shadow-lg',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const textDirection = isRtl ? 'text-right' : 'text-left';

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${paddings[padding]}
          ${textDirection}
          ${className}
        `}
        dir={direction}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
