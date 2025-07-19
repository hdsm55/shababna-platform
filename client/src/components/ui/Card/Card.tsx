import React from 'react';
import { getCardClasses } from '../../common/DesignSystem';
import { DESIGN_SYSTEM } from '../../common/DesignSystem';

export type CardVariant = 'default' | 'accent' | 'elevated' | 'primary';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  dir?: 'rtl' | 'ltr';
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      dir,
      className = '',
      children,
      hoverable = false,
      ...props
    },
    ref
  ) => {
    const direction =
      dir ||
      (typeof document !== 'undefined'
        ? (document.documentElement.dir as 'rtl' | 'ltr')
        : 'rtl');
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    return (
      <div
        ref={ref}
        className={[
          getCardClasses(variant),
          paddings[padding],
          hoverable
            ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1'
            : '',
          `focus:outline-none focus:ring-2 focus:ring-[${DESIGN_SYSTEM.colors.primary}] focus:ring-offset-2`,
          className,
        ].join(' ')}
        dir={direction}
        role="region"
        aria-label={props['aria-label']}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
